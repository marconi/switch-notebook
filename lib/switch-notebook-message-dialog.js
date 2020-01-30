'use babel';

import React from 'react';
import { CompositeDisposable } from 'event-kit';
import { Dropdown } from 'semantic-ui-react';

export default class SwitchNotebookMessageDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { books: [] };

    inkdrop.onAppReady(() => {
      const { books } = inkdrop.store.getState();
      const options = books.all.map(({ _id, name }) => ({
        key: _id,
        value: _id,
        text: name,
      }));
      this.setState({ options });
    });
  }

  componentWillMount() {
    // Events subscribed to in Inkdrop's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this dialog
    this.subscriptions.add(
      inkdrop.commands.add(document.body, {
        'switch-notebook:toggle': () => this.toggle(),
      }),
    );
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  handleSwitch = (event, data) => {
    inkdrop.commands.dispatch(document.body, 'core:note-list-show-notes-in-book', {
      bookId: data.value,
    });
    this.refs.dialog.dismissDialog();
  };

  toggle() {
    const { dialog } = this.refs;
    if (!dialog.isShown) {
      dialog.showDialog();
    } else {
      dialog.dismissDialog();
    }
  }

  render() {
    const { MessageDialog } = inkdrop.components.classes;
    return (
      <MessageDialog
        ref="dialog"
        title="Switch Notebook"
        buttons={[]}
        modalSettings={{ autofocus: true }}
      >
        <Dropdown
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
