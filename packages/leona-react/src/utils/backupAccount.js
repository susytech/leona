import FileSaver from 'file-saver';
import susyStore from '../stores/susyStore';

export default (address, password) =>
  susyStore.api.susy.exportAccount(address, password).then(res => {
    const blob = new window.Blob([JSON.stringify(res)], {
      type: 'application/json; charset=utf-8'
    });

    FileSaver.saveAs(blob, `${res.address}.json`);
  });
