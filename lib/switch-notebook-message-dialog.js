'use babel';

import React from 'react';
import { CompositeDisposable } from 'event-kit';
import { Dropdown } from 'semantic-ui-react';

export default class SwitchNotebookMessageDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = { options: [], bookId: '' };
    this.dialogRef = React.createRef();
  }

  componentWillMount() {
    // Events subscribed to in Inkdrop's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this dialog
    this.subscriptions.add(
      inkdrop.commands.add(document.body, {
        'switch-notebook:toggle': () => this.toggle(),
      })
    );

    // Getting Notebooks
    this.buildDictionary();
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  buildDictionary() {
    const { books } = inkdrop.store.getState();
    const options = books.all.map(({ _id, name }) => ({
      key: _id,
      value: _id,
      text: name,
    }));
    this.setState({ options });
  }

  switchNotebook(bookId) {
    inkdrop.commands.dispatch(document.body, 'core:note-list-show-notes-in-book', {
      bookId: bookId,
    });
    inkdrop.commands.dispatch(document.body, 'core:focus-note-list-bar');
    this.dialogRef.current.dismissDialog();
  }

  handleSwitch = (event, data) => {
    const switchWithReturnKey = inkdrop.config.get('switch-notebook.switchWithReturnKey');

    if (switchWithReturnKey) {
      this.setState({ bookId: data.value });
    } else {
      this.switchNotebook(data.value);
    }
  };

  handleKeyUp = (event) => {
    const switchWithReturnKey = inkdrop.config.get('switch-notebook.switchWithReturnKey');

    if (switchWithReturnKey && event.keyCode === 13) {
      this.switchNotebook(this.state.bookId);
    }
  };

  toggle() {
    if (!this.dialogRef.current.isShown) {
      this.dialogRef.current.showDialog();
    } else {
      this.dialogRef.current.dismissDialog();
    }
  }

  render() {
    const { MessageDialog } = inkdrop.components.classes;
    return (
      <MessageDialog
        ref={this.dialogRef}
        title="Switch Notebook"
        buttons={[]}
        modalSettings={{ autofocus: true }}
      >
        <Dropdown
          onKeyUp={this.handleKeyUp}
          options={this.state.options}
          placeholder="Select notebook"
          onChange={this.handleSwitch}
          searchInput={<Dropdown.SearchInput className="ui input" />}
          fluid
          selection
          search
        />
      </MessageDialog>
    );
  }
}
