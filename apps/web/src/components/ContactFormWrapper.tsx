// apps/web/src/components/ContactFormWrapper.tsx
import { getContactForm } from '@/lib/api';
import RequestForm from './RequestForm';

interface ContactFormWrapperProps {
  preselectedService?: string;
}

export default async function ContactFormWrapper({ 
  preselectedService 
}: ContactFormWrapperProps) {
  const contactForm = await getContactForm();
  
  return (
    <RequestForm 
      preselectedService={preselectedService}
      cmsConfig={contactForm || undefined}
    />
  );
}
