'use babel';

import SwitchNotebookMessageDialog from './switch-notebook-message-dialog';

module.exports = {
  activate() {
    inkdrop.components.registerClass(SwitchNotebookMessageDialog);
    inkdrop.layouts.addComponentToLayout('modal', 'SwitchNotebookMessageDialog');
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout('modal', 'SwitchNotebookMessageDialog');
    inkdrop.components.deleteClass(SwitchNotebookMessageDialog);
  },
};
