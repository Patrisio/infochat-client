import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Title from '../../components/Title/Title';
import styles from './start.module.scss';

import channels from '../../assets/channels.svg';
import teammates from '../../assets/teammates.svg';
import template from '../../assets/template.svg';
import stats from '../../assets/stats.svg';

export default function Start() {
  let { projectId } = useParams<{ projectId: string }>();

  const settings = [
    {
      imageSrc: channels,
      alt: 'channels',
      backgroundColor: '#f5fff5',
      title: 'Каналы',
      description: 'Добавьте каналы связи для вашего проекта или настройте чат для сайта.',
      linkText: 'Добавить и настроить каналы ›',
      linkHref: `/project/${projectId}/settings/channels`,
    },
    {
      imageSrc: teammates,
      alt: 'teammates',
      backgroundColor: 'snow',
      title: 'Сотрудники',
      description: 'Пригласите в ваш проект операторов для ответов на входящие сообщения и поддержки клиентов.',
      linkText: 'Добавить и управлять сотрудниками ›',
      linkHref: `/project/${projectId}/settings/teammates`,
    },
    {
      imageSrc: template,
      alt: 'template',
      backgroundColor: '#faffec',
      title: 'Шаблоны ответов',
      description: 'Настройте шаблоны ответов для операторов, чтобы реагировать на сообщения клиентов быстрее.',
      linkText: 'Настроить шаблоны ответов ›',
      linkHref: ``,
    },
    {
      imageSrc: stats,
      alt: 'stats',
      backgroundColor: '#f4fffd',
      title: 'Статистика',
      description: 'Подключите статистику и определяйте популярные каналы, часы пиковой нагрузки и лучших операторов.',
      linkText: 'Перейти к статистике ›',
      linkHref: ``,
    },
  ];

  return (
    <div className={styles.startContainer}>
      <Title text='Настройки' />

      <div className={styles.startContent}>
        {
          settings.map(({ imageSrc, alt, backgroundColor, title, description, linkText, linkHref }, idx) => {
            return (
              <Link
                key={idx}
                to={linkHref}
                className={styles.feature}
              >
                <div
                  className={styles.imageContainer}
                  style={{ background: backgroundColor}}
                >
                  <img src={imageSrc} alt={alt}/>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{ title }</h3>
                  <p className={styles.description}>{ description }</p>
                  <Link
                    className={styles.link}
                    to={linkHref}
                  >
                    { linkText }
                  </Link>
                </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
}