// Saves options to chrome.storage
const saveOptions = () => {
  const input = document.getElementById('num_comments');
  const parsed = parseInt(input.value, 10);
  const num_comments = Number.isNaN(parsed) || parsed < 0 ? 1 : parsed;
  input.value = num_comments;

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
      const parsed = parseInt(items.num_comments, 10);
      document.getElementById('num_comments').value =
        Number.isNaN(parsed) || parsed < 0 ? 1 : parsed;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);