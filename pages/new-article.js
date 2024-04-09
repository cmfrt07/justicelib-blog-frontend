import styles from '../styles/EditArticle.module.css';
import RouteGuard from '../components/RouteGuard';
import { logoutSuccess } from '../reducers/authReducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import Link from 'next/link';



function NewArticle() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector(state => state.auth.token);
  const textAreaRef = useRef(null);
  const [articles, setArticles] = useState([]);



  //Actualisation du token
  useEffect(() => {
    if (isAuthenticated && token) {
      console.log(token + ' - Première vérification du token');
      const interval = setInterval(() => {
        console.log(token +  '- Deuxieme vérification du token pour un éventuel rafraîchissement');
        refreshToken(token)
      }, 300000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, dispatch]);


  const refreshToken = async (currentToken) => {
    try {
      const response = await fetch(`https://justicelib-blog-backend.vercel.app/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: currentToken })
      });
  
      const data = await response.json();
      if (data && data.token) {
        console.log('nouveau token bien régénéré ' + data.token)
        dispatch(refreshTokenSuccess({ newToken: data.token }));
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
  };
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://justicelib-blog-backend.vercel.app/get-articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };
  
    fetchArticles();
  }, []);



  const deleteArticle = async (articleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const response = await fetch(`https://justicelib-blog-backend.vercel.app/articles/${articleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          setArticles(articles.filter(article => article._id !== articleId)); // Mettre à jour l'état pour refléter la suppression
        } else {
          alert('Erreur lors de la suppression de l\'article.');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        alert('Erreur lors de la suppression de l\'article.');
      }
    }
  }

  return(
    <RouteGuard>
      <div className={styles.editArticleContainer}>
        <div className={styles.header}>
          <div className={styles.menu}>
            <h1>Justicelib</h1>
            <Link href='/new-article'>
              <a>Articles</a>
            </Link>
            <Link href='/publish-article'>
              <a>Publier</a>
            </Link>
          </div>
          <a className={styles.logout} onClick={handleLogout}>Se déconnecter</a>
        </div>
        <div className={styles.editArticleBox}>
          <div className={styles.editArticleHeader}>
            <p>
              Publiez ou éditez de nouveaux articles depuis cette page.
            </p>
          </div>
          <div className={styles.articlesContainer}>

          {articles.map((article, index) => (
            <div key={index} className={styles.articleItem}>
              <div>
                <h2>{article.titre}</h2>
                <span>{article.categorie}/{article.date}</span>
              </div>
              <div>
                <div className={styles.btnDiv}>
                  <Link href={`/edit-article/${article._id}`}>
                    <a className={styles.editBtn}>Editer</a>
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => deleteArticle(article._id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}


          </div>
        </div>
        <p>© Justicelib 2024</p>
      </div>
    </RouteGuard>
  );
}

export default NewArticle;
