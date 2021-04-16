import React, { useContext } from 'react';
import { Context } from '../../context/Context';

export default function CurrentUserInfo() {
  const { currentUser } = useContext(Context);

  return (
    <div>
      {currentUser.username}
    </div>
  );
}