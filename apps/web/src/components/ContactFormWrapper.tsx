// apps/web/src/components/ContactFormWrapper.tsx
import { getContactForm } from '@/lib/api';
import RequestForm from './RequestForm';

interface ContactFormWrapperProps {
  preselectedService?: string;
  equipmentTypes?: string[];
}

export default async function ContactFormWrapper({ 
  preselectedService, 
  equipmentTypes 
}: ContactFormWrapperProps) {
  const contactForm = await getContactForm();
  
  return (
    <RequestForm 
      preselectedService={preselectedService}
      equipmentTypes={equipmentTypes}
      cmsConfig={contactForm || undefined}
    />
  );
}
