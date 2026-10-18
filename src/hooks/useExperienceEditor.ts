import { useEffect, useState } from 'react';

const useExperienceEditor = () => {
  const [inExperienceEditor, set_inExperienceEditor] = useState<null | boolean>(null);
  useEffect(() => {
    const isPageEditor = !!(
      typeof (window as any).Sitecore !== 'undefined' &&
      typeof (window as any).Sitecore.PageModes !== 'undefined' &&
      typeof (window as any).Sitecore.PageModes.PageEditor !== 'undefined'
    );
    set_inExperienceEditor(isPageEditor);
  }, []);

  return inExperienceEditor;
};

export default useExperienceEditor;
