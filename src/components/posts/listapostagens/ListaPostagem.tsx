import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Card, CardActions, CardContent, Button, Typography, CardMedia } from '@material-ui/core';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import './ListaPostagem.css';
import Postagem from '../../../models/Postagem';
import { busca, put } from '../../../services/Service';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify'
function ListaPostagem() {

  const [posts, setPosts] = useState<Postagem[]>([])

  const [post, setPost] = useState<Postagem>({
    id: 0,
    titulo: "",
    texto: "",
    data: "",
    curtir: 0,
    tema: null
  })

  const token = useSelector<TokenState, TokenState["tokens"]>(
    (state) => state.tokens
  )

  let navigate = useNavigate();

  useEffect(() => {
    if (token === "") {
      toast.error('Você precisa estar logado para completar a ação', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",

      }); navigate("/login")

    }
  }, [token])

  async function curtidas(id: number) {
    await put(`/postagens/curtir/${id}`, post, setPost, {
      headers: {
        'Authorization': token
      }
    }
    );
    getPost()
  }

  async function getPost() {
    await busca("/postagens", setPosts, {
      headers: {
        'Authorization': token
      }
    })
  }

  useEffect(() => {
    getPost()
  }, [posts.length])

  return (
    <Box className='BoxFragmentPostagem'>
      <>
        {
          posts.map(post => (
            <Box className='backBoxPosts' >
              <Card variant="outlined" className='cardBackHome'>
                <CardMedia component="img" height="194" image="https://cutewallpaper.org/21/junji-ito-wallpaper/Junji-Ito-Manga-Anime-Comparison-Mood-board-Junji-.jpg" alt="Paella dish" />
                <CardContent>
                  <Typography className="subtitulo" gutterBottom>
                    Postagens:
                  </Typography>
                  <Typography className='textosCard' variant="h5" component="h2">
                    {post.titulo}
                  </Typography>
                  <Typography className='subtitulo' variant="body2" component="p">
                    Conteúdo:
                  </Typography>
                  <Typography className='textosCard' variant="body2" component="p">
                    {post.texto}
                  </Typography>
                  <Typography className='subtitulo' variant="body2" component="p">
                    Tema:
                  </Typography>
                  <Typography className='textosCard' variant="body2" component="p">
                    {post.tema?.descricao}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box className='botaoBox' mb={1.5}>
                    <Link to={`/formulariopostagem/${post.id}`} className="text-decorator-none" >
                      <Box mx={1}>
                        <Button color="secondary" variant="contained" size='small' className='botaoPosts'  >
                          atualizar
                        </Button>
                      </Box>
                    </Link>
                    <Link to={`/deletarpostagem/${post.id}`} className="text-decorator-none">
                      <Box mx={1}>
                        <Button variant="contained" size='small' className='botaoPosts'>
                          deletar
                        </Button>
                      </Box>
                    </Link>
                    <Box mx={1}>
                      <Button onClick={() => { curtidas(post.id) }} ><ThumbUpIcon color='action'></ThumbUpIcon></Button>
                      <Typography style={{ color: 'black' }} align='center' variant="body2" component="p"> {post.curtir}</Typography>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          ))
        }
      </>
    </Box>
  )
}

export default ListaPostagem;