import { useContext } from 'react';
import { LanguageContext } from '../components/LanguageProvider';

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;