import { FormEvent, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';

import styles from '../styles/Home.module.css'

export default function HomePage() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('matt@rocketseat.team');
  const [password, setPassword] = useState('123456');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await signIn({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        placeholder="Type your e-mail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Type your password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
