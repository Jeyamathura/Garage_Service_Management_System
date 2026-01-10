import styles from './Header.module.css';
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Garage Service Management System</h1>
        <p className={styles.subtitle}>Efficiently manage services, vehicles, and customers</p>
      </div>
    </header>
  );
};

export default Header;
