
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../../styles/Article.module.css'
import Link from 'next/link';
import Navbar from '../../components/Navbar';

function Article() {
  const router = useRouter();
  const { id } = router.query;

  const [titre, setTitre] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categorie, setCategorie] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (id) {
        try {
          const res = await fetch(`https://justicelib-blog-backend.vercel.app/articles/${id}`);
          const data = await res.json();
          setTitre(data.titre);
          setContent(data.content);
          setImageUrl(data.url);
          setCategorie(data.categorie);
          setDate(data.date);
          const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });



          setDate(formattedDate);
        } catch (error) {
          console.error('Error fetching article details:', error);
        }
      }
    };

    fetchArticleDetails();
  }, [id]);

  const renderContent = (content) => {
  return content.split(/\*\*(.*?)\*\*/).map((text, index) => {
    return index % 2 === 1 ? (
      <h3 key={index}>{text}</h3>
    ) : (
      <p key={index}>{text}</p>
    );
  });
};


  return (
    <div className={styles.bg}>
    <div className={styles.articleSection}>
    <div className={styles.navbarBox}>
      <Navbar/>
    </div>
    <button className={styles.previousBlogBis}>
      <a href="/blog" >←&nbsp;Retour</a>
    </button>
    <img src={imageUrl} alt="" className={styles.articlePageImage}/>
    <h1 className={styles.articleTitleW}>{titre}</h1>
    <div className={styles.authorSection}>
    <p>JUSTICELIB / {date} / {categorie}</p>
    </div>
    <div className={styles.articleHeader}>
      <div className={styles.articleContent}>
      {renderContent(content)}

    </div>
    <button href="" className={styles.moreArticle}>
      <Link href='/blog'>
        <a style={{color: '#ffffff'}}>Plus d'articles</a>
      </Link>
      </button> 
      <p className={styles.footer}>© Justicelib 2024</p>  
    </div>

    </div>
    </div>
  );
}

export default Article;