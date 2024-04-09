import styles from '../../styles/EditArticle.module.css';
import RouteGuard from '../../components/RouteGuard';
import { logoutSuccess } from '../../reducers/authReducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

function EditArticle() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const textAreaRef = useRef(null);

  const [titre, setTitre] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categorie, setCategorie] = useState('');

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (id) {
        try {
          const res = await fetch(`https://justicelib-blog-backend.vercel.app/articles/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setTitre(data.titre);
          setContent(data.content);
          setImageUrl(data.url);
          setCategorie(data.categorie);
        } catch (error) {
          console.error('Error fetching article details:', error);
        }
      }
    };

    fetchArticleDetails();
  }, [id, token]);


  const makeBold = () => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const selectedText = content.slice(start, end);
  
      // Vérifier si aucun texte n'est sélectionné
      if (selectedText.length === 0) {
        console.log('Aucun texte sélectionné');
        return;
      }
  
      const beforeText = content.slice(0, start);
      const afterText = content.slice(end);
  
      // Vérifier si le texte sélectionné est déjà en gras
      if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
        // Retirer les étoiles pour enlever le gras
        const newText = selectedText.slice(2, selectedText.length - 2);
        setContent(`${beforeText}${newText}${afterText}`);
      } else {
        // Ajouter les étoiles pour mettre en gras
        setContent(`${beforeText}**${selectedText}**${afterText}`);
      }
    }
  };
  


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
  

  const saveArticle = async () => {
    if (!titre || !content || !imageUrl || !categorie) {
      alert('Tous les champs sont requis.');
      return;
    }

    const articleData = { titre, content, imageUrl, categorie };

    try {
      const res = await fetch(`https://justicelib-blog-backend.vercel.app/update-articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });

      if (res.ok) {
        router.push('/new-article');
      } else {
        alert('Erreur lors de la mise à jour de l\'article');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
    }
  };



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

            <div className={styles.inputContainer}>
              <label>Titre de l'article:</label>
              <input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <label>Url de l'image (format 16:9):</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <label>Catégorie:</label>
              <input
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              />
            </div>

            <button className={styles.boldBtn} onClick={makeBold}>
              Titre
            </button>

          </div>
          <div className={styles.textContainer}>
            <textarea
              ref={textAreaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className={styles.publishBtn} onClick={saveArticle}>
            Enregistrer
          </button>
        </div>
        <p>© Justicelib 2024</p>
      </div>
    </RouteGuard>
  );
}

export default EditArticle;
