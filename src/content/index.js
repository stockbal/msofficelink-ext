import { injectIntoPage } from './contentInjection';
import { ExtStorage } from '../ext/ExtStorage';
import { FilterListUtil } from '../util/FilterListUtil';

const inject = async () => {
  const settings = await ExtStorage.getSettings();

  let injectionAllowed = false;
  if (settings.filterListType === 'black') {
    injectionAllowed = FilterListUtil.checkAgainstBlackList(
      window.location,
      settings.urlFilterList
    );
  } else {
    injectionAllowed = FilterListUtil.checkAgainstWhiteList(
      window.location,
      settings.urlFilterList
    );
  }
  if (injectionAllowed) {
    injectIntoPage();
  }
};
inject();
