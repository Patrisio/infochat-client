import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './inviteForm.module.scss';
import { authInvite } from '../../actions';

interface ParamTypes {
  inviteId: string,
  projectId: string
}

export default function InviteForm() {
  let { inviteId, projectId } = useParams<ParamTypes>();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      localStorage.removeItem('token');
    }

    localStorage.setItem('token', inviteId);
  }, []);

  const joinToProject = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string },
      surname: { value: string },
      password: { value: string },
      confirmPassword: { value: string };
    };

    const name = target.name.value;
    const surname = target.surname.value;
    const password = target.password.value;
    const confirmPassword = target.confirmPassword.value;

    if (password === confirmPassword) {
      const successCallback = (data: any) => {
        if (data.code === 200) {
          window.location.href = `/project/${projectId}/inbox/opened`;
        }
      };

      dispatch(authInvite({
        username: `${name} ${surname}`,
        password,
        projectId,
        inviteId,
        successCallback,
      }));
    } else {
      alert('Пароли не совпадают');
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form
        method='POST'
        onSubmit={joinToProject}
        className={styles.form}
      >
        <h1 className={styles.h1}>Добро пожаловать в InfoChat</h1>
        <Input
          placeholder='Имя'
          type='text'
          name='name'
          fluid
        />
        <Input
          placeholder='Фамилия'
          type='text'
          name='surname'
          fluid
        />
        <Input
          placeholder='Пароль'
          type='password'
          name='password'
          fluid
        />
        <Input
          placeholder='Подтвердите пароль'
          type='password'
          name='confirmPassword'
          fluid
        />
        <Button
          type='submit'
          fluid
        >
          Присоединиться к проекту
        </Button>
      </form>
    </div>
  );
}