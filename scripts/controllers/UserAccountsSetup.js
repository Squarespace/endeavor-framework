import { UserAccounts } from '@squarespace/core';

function UserAccountsSetup (element) {
  const handleClick = (e) => {
    e.preventDefault();
    UserAccounts.openAccountScreen();
  };

  const initUserAccounts = () => {
    const unusedSelector = UserAccounts.isUserAuthenticated() ? '.sign-in' : '.my-account';
    const unusedNode = element.querySelector(unusedSelector);

    if (unusedNode) {
      unusedNode.parentNode.removeChild(unusedNode);
    }
    element.classList.add('loaded');
    element.addEventListener('click', handleClick);
  };

  const destroy = () => {
    element.removeEventListener('click', handleClick);
  };

  initUserAccounts();

  return {
    destroy
  };
}

export default UserAccountsSetup;
