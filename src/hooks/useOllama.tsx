import { useState } from 'react';

interface UseToggleReturn {
  value: boolean;
  toggleValue: () => void;
}

const useOllama = (url:string): UseToggleReturn => {
  const [serviceURL, setServiceURL] = useState(url);

  const  = () => {
    setValue(!value);
  };

  return { value, toggleValue };
};

export default useToggle;
