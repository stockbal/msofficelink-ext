const OPEN_TO_READ = 'read';
const OPEN_TO_EDIT = 'edit';
const OPEN_ONLINE = 'online';
const DOWNLOAD_FILE = 'download';
const CREATE_FAV = 'markasfav';
const OPEN_PARENT_FOLDER = 'parent';

export const ContextId = {
  CLIP_BOARD: 'clipboard',
  ORIGINAL_TO_CLIPBOARD: 'clipboard-original',
  OPEN_PROTECTED_TO_CLIPBOARD: 'clipboard-open-protected',
  OPEN_TO_EDIT_TO_CLIPBOARD: 'clipboard-open-edit',
  OPEN_ONLINE_TO_CLIPBOARD: 'clipboard-open-online',
  OPEN_TO_READ,
  OPEN_TO_EDIT,
  OPEN_ONLINE,
  DOWNLOAD_FILE,
  CREATE_FAV,
  OPEN_PARENT_FOLDER
};

export const ActionId = {
  OPEN_TO_READ,
  OPEN_TO_EDIT,
  OPEN_ONLINE,
  DOWNLOAD_FILE,
  CREATE_FAV,
  OPEN_PARENT_FOLDER,
  OPEN_OWNER_PAGE: 'owner',
  COPY_LINK: 'copylink',
  ORIGINAL_LINK: 'original'
};
