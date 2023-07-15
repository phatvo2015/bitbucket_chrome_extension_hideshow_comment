// Saves options to chrome.storage
const saveOptions = () => {
  const num_comments = document.getElementById('num_comments').value;

  chrome.storage.sync.set(
    { num_comments: num_comments },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { num_comments: 1 },
    (items) => {
      document.getElementById('num_comments').value = items.num_comments;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);