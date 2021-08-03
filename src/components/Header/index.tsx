
import format from 'date-fns/format';
import enNZ from 'date-fns/locale/en-NZ'
import styles from './styles.module.scss';

export function Header() {
    const currentDate = format(new Date(), 'EEEE, d MMMM', {
        locale: enNZ
    });

    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr" />

            <p>The best to listen, always.</p>

            <span>{currentDate}</span>
        </header>
    );
}