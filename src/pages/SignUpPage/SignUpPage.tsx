import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { authSignIn, authSignUp } from '../../actions';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './SignUpPage.module.scss';
import { Context } from '../../context/Context';

export default function SignUpPage()  {
  const { currentUser } = useContext(Context);
  const dispatch = useDispatch();
  currentUser.email = 'hellO@mail.ru';

  const signUpUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      username: { value: string },
      email: { value: string },
      phone: { value: string },
      password: { value: string },
    };

    const username = target.username.value;
    const email = target.email.value;
    const phone = target.phone.value;
    const password = target.password.value;
    const successCallback = (data: {
      accessToken: string,
      projectId: string,
    }) => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      localStorage.setItem('token', data.accessToken);
      window.location.href = `/project/${data.projectId}/inbox/opened`;
    };

    dispatch(authSignUp({
      username,
      email,
      phone,
      password,
      role: 'owner',
      status: 'active',
      successCallback,
    }));
  };

  return (
    <div className={styles.formWrapper}>
      <form
        method='POST'
        onSubmit={signUpUser}
        className={styles.form}
      >
        <h1 className={styles.h1}>Регистрация в InfoChat</h1>
        <Input
          placeholder='Имя'
          type='text'
          name='username'
          fluid
        />
        <Input
          placeholder='Телефон'
          type='phone'
          name='phone'
          fluid
        />
        <Input
          placeholder='E-mail'
          type='email'
          name='email'
          fluid
        />
        <Input
          placeholder='Пароль'
          type='password'
          name='password'
          fluid
        />
        <Button
          type='submit'
          fluid
        >
          Зарегистрироваться
        </Button>
        <p className={styles.formFooter}>
          Уже есть аккаунт?
          <Link
            to='/signin'
            className={styles.link}
          >
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}