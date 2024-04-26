import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

function Home() {
  const [articles, setArticles] = useState([]);


  function cleanContent(content) {
    return content.replace(/\*\*.*?\*\*/g, '');
  }
  
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://justicelib-blog-backend.vercel.app/get-articles');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);


  return (
  <div className={styles.home}>
    <div className={styles.navbarBox}>
    <Navbar/>
    </div>
    <section>
      <div className={styles.blogSection}>
        <button className={styles.previousBlog}>
            <a href="https://declarations.justicelib.fr/" className={styles.retourLink}>←&nbsp;Retour</a>
        </button>
        <div className={styles.articlesTitle}>
          <h1>Articles</h1>
          <p>Retrouvez ici tous nos différents articles consacrés à l'univers des lettres de mise en demeure. Que vous soyez un professionnel cherchant à comprendre les nuances légales de ces documents ou un particulier souhaitant défendre ses droits avec efficacité, notre site vous propose des guides complets, des astuces pratiques et des analyses approfondies. Découvrez comment maximiser l'impact de vos mises en demeure et apprenez à naviguer avec aisance dans les méandres des obligations légales.</p>
        </div>
        <div className={styles.articlesContainer}>




        {articles.slice().reverse().map((article, index) => (
          <a key={index} className={styles.articlePreview} href={`/articles/${article._id}`}>
            <img src={article.url} alt={article.titre} />
            <h3>{article.titre}</h3>
            <p>{cleanContent(article.content).substring(0, 250)}...</p>
            <p className={styles.author}>{article.categorie} / {new Date(article.date).toLocaleDateString()}</p>
          </a>
        ))}
        </div>
      </div>
    </section>
    <p className={styles.footer}>© Justicelib 2024</p>
  </div>

  );
}

export default Home;
