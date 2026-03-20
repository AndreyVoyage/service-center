#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Получаем __dirname в ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Игнорируемые папки и файлы
const IGNORE_PATTERNS = [
  '.git', 'node_modules', '__pycache__', '.venv', 'venv', 
  'dist', 'build', '.next', '.nuxt', 'coverage', '.coverage',
  '.DS_Store', 'Thumbs.db', 'package-lock.json', 'yarn.lock', 
  'poetry.lock', 'Gemfile.lock', '.env', '.env.local', 
  '.env.production', '*.min.js', '*.min.css',
  'uploads', 'storage', 'logs', 'tmp', 'temp', '.cache',
  'PROJECT_STRUCTURE.md' // Игнорируем сам себя
];

const TEXT_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.yml', '.yaml', 
  '.html', '.css', '.scss', '.sass', '.vue', '.php', '.rb', '.go', 
  '.rs', '.java', '.kt', '.sql', '.prisma', '.env', '.txt', '.sh', 
  '.bash', '.dockerfile', '.gitignore', '.eslintrc', '.prettierrc',
  '.xml', '.svg', '.ini', '.conf', '.config', '.toml', '.cjs', '.mjs'
];

function shouldIgnore(filePath) {
  const basename = path.basename(filePath);
  const parts = filePath.split(path.sep);
  
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.startsWith('*')) {
      if (basename.endsWith(pattern.slice(1))) return true;
    } else {
      if (parts.includes(pattern) || basename === pattern) return true;
    }
  }
  return false;
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.includes(ext)) return true;
  
  // Проверка на бинарность по содержимому
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length === 0) return true;
    // Проверка на null bytes (признак бинарного файла)
    for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
      if (buffer[i] === 0) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getGitRemoteUrl() {
  try {
    const url = execSync('git remote get-url origin', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    
    // Преобразуем git@ в https
    if (url.startsWith('git@github.com:')) {
      return url.replace('git@github.com:', 'https://github.com/').replace(/\.git$/, '');
    }
    return url.replace(/\.git$/, '');
  } catch {
    return null;
  }
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'main';
  }
}

function categorizeFile(filePath) {
  const lower = filePath.toLowerCase();
  
  if (/readme|license|contributing|changelog|package\.json|requirements\.txt|composer\.json|dockerfile|docker-compose|\.md$/.test(lower)) {
    return 'config';
  }
  if (/server|backend|api|app|routes|controllers|models|middleware|services/.test(lower) && /\.(js|ts|py|php|go|rb|java)$/.test(lower)) {
    return 'backend';
  }
  if (/frontend|client|components|pages|views|app\/.*\.(jsx|tsx|vue)$/.test(lower) && /\.(jsx|tsx|vue|html|css|scss)$/.test(lower)) {
    return 'frontend';
  }
  if (/prisma|migrations|schema|\.sql$|database|db/.test(lower)) {
    return 'database';
  }
  return 'other';
}

function generateStructure() {
  console.log('🔍 Анализ репозитория...');

  const githubUrl = getGitRemoteUrl();
  if (!githubUrl) {
    console.error('❌ Ошибка: Не удалось определить GitHub URL.');
    console.error('   Убедись, что установлен git remote origin');
    process.exit(1);
  }

  const branch = getCurrentBranch();
  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    console.error('❌ Ошибка: Не распознан GitHub URL');
    process.exit(1);
  }

  const [, user, repo] = match;
  const rawBase = `https://raw.githubusercontent.com/${user}/${repo}/${branch}`;

  console.log(`✅ Репозиторий: ${user}/${repo}`);
  console.log(`✅ Ветка: ${branch}`);

  const fileList = [];

  function scanDir(dir, relativePath = '') {
    const items = fs.readdirSync(dir).filter(item => {
      const fullPath = path.join(dir, item);
      return !shouldIgnore(fullPath);
    }).sort((a, b) => {
      const aPath = path.join(dir, a);
      const bPath = path.join(dir, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item).replace(/\\/g, '/');
      const isDir = fs.statSync(fullPath).isDirectory();

      if (isDir) {
        scanDir(fullPath, relPath);
      } else {
        const isText = isTextFile(fullPath);
        fileList.push({
          path: relPath,
          type: isText ? 'text' : 'binary',
          url: isText ? `${rawBase}/${relPath}` : null,
          category: isText ? categorizeFile(relPath) : 'binary'
        });
      }
    });
  }

  scanDir('.');

  console.log(`📊 Найдено файлов: ${fileList.length}`);

  // Генерация Markdown
  const output = [];
  output.push(`# Структура проекта: ${repo}`);
  output.push('');
  output.push(`**Репозиторий:** ${githubUrl}  `);
  output.push(`**Ветка:** \`${branch}\`  `);
  output.push(`**Сгенерировано:** ${new Date().toLocaleString()}`);
  output.push('');

  // Дерево файлов
  output.push('## 📂 Дерево файлов');
  output.push('');
  output.push('```');
  output.push(`📦 ${repo}/`);
  
  // Рекурсивное построение дерева для вывода
  function buildTreeOutput(currentDir, prefix = '') {
    const items = fs.readdirSync(currentDir).filter(item => {
      const fullPath = path.join(currentDir, item);
      return !shouldIgnore(fullPath);
    }).sort((a, b) => {
      const aPath = path.join(currentDir, a);
      const bPath = path.join(currentDir, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    items.forEach((item, index) => {
      const fullPath = path.join(currentDir, item);
      const isLast = index === items.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const isDir = fs.statSync(fullPath).isDirectory();
      
      output.push(`${prefix}${connector}${item}${isDir ? '/' : ''}`);
      
      if (isDir) {
        buildTreeOutput(fullPath, prefix + (isLast ? '    ' : '│   '));
      }
    });
  }

  try {
    const rootItems = fs.readdirSync('.').filter(item => !shouldIgnore(item))
      .sort((a, b) => {
        const aIsDir = fs.statSync(a).isDirectory();
        const bIsDir = fs.statSync(b).isDirectory();
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

    rootItems.forEach((item, index) => {
      const fullPath = path.join('.', item);
      const isLast = index === rootItems.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const isDir = fs.statSync(fullPath).isDirectory();
      
      output.push(`${connector}${item}${isDir ? '/' : ''}`);
      
      if (isDir) {
        buildTreeOutput(fullPath, isLast ? '    ' : '│   ');
      }
    });
  } catch (err) {
    console.error('Ошибка при построении дерева:', err);
  }

  output.push('```');
  output.push('');

  // Ссылки по категориям
  output.push('## 🔗 Raw-ссылки для AI-анализа');
  output.push('');
  output.push('Копируй эти ссылки и отправляй AI для просмотра содержимого файлов:');
  output.push('');

  const categories = {
    config: '📋 Конфигурация и документация',
    backend: '⚙️ Backend / API',
    frontend: '🎨 Frontend',
    database: '🗄️ База данных / Миграции',
    other: '📄 Прочие файлы',
    binary: '🔴 Бинарные файлы (пропущены)'
  };

  for (const [cat, title] of Object.entries(categories)) {
    const files = fileList.filter(f => f.category === cat || (cat === 'binary' && f.type === 'binary'));
    if (files.length === 0) continue;
    
    output.push(`### ${title}`);
    output.push('');
    
    for (const file of files) {
      if (file.type === 'text' && file.url) {
        output.push(`- [${file.path}](${file.url})`);
      } else {
        output.push(`- ${file.path} (binary)`);
      }
    }
    output.push('');
  }

  output.push('---');
  output.push('');
  output.push('💡 **Как использовать:**');
  output.push('1. Открой этот файл на GitHub');
  output.push('2. Найди нужные файлы в разделах выше');
  output.push('3. Скопируй raw-ссылку и отправь AI с вопросом "Проанализируй этот файл"');

  fs.writeFileSync('PROJECT_STRUCTURE.md', output.join('\n'));
  console.log('✅ Файл PROJECT_STRUCTURE.md создан успешно!');
  console.log('');
  console.log('📋 Следующие шаги:');
  console.log('   1. git add PROJECT_STRUCTURE.md');
  console.log('   2. git commit -m "docs: добавлена структура проекта"');
  console.log('   3. git push');
  console.log('   4. Открой PROJECT_STRUCTURE.md на GitHub и копируй оттуда ссылки');
}

generateStructure();