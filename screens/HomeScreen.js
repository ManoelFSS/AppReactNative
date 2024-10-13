// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, TextInput } from 'react-native';
import { getMoviesFromDBMovies } from '../services/api'; // Importa a função de busca de filmes

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`); // URL padrão
  const [searchQuery, setSearchQuery] = useState(''); // Estado para o texto da pesquisa

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getMoviesFromDBMovies(url);
        setMovies(moviesData); // Armazena os filmes no estado
        setFilteredMovies(moviesData); // Inicialmente, todos os filmes são exibidos
      } catch (err) {
        setError(err);
        console.error('Erro ao buscar filmes:', err);
      }
    };

    fetchMovies();
  }, [url]); // Executa o efeito sempre que a URL mudar

  const handleCategoryChange = (category) => {
    setUrl(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      // Atualiza a URL para a pesquisa
      const searchUrl = `https://api.themoviedb.org/3/search/movie?&query=${query}&include_adult=false&language=pt-BR&page=1`;
      setUrl(searchUrl); // Define a URL para busca
    } else {
      // Se a pesquisa estiver vazia, mostra os filmes populares
      setUrl(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header com Menu de Categorias */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❍ Movies</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => handleCategoryChange(`https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY&with_genres=27&language=pt-BR&page=1`)
}>
            <Text style={styles.categoryText}>POST-APOCALYPTIC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCategoryChange(`https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1`)}>
            <Text style={styles.categoryText}>HEIST</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCategoryChange(`https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY&with_genres=28&language=pt-BR&page=1`)
}>
            <Text style={styles.categoryText}>SUPERHERO</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar filme..."
          placeholderTextColor="#BDC3C7" // Define a cor do placeholder como cinza claro
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de Filmes */}
      {error ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Erro ao carregar filmes.</Text>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Details', { movie: item })}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} // Adiciona a URL base
                  style={styles.movieImage} // Aplica o estilo
                />
              </View>
            </TouchableOpacity>
          )}
          numColumns={1} // Exibe as imagens em 1 coluna
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2C3E50', // Cor de fundo do cabeçalho
        paddingTop: 45, // Espaçamento vertical
        paddingBottom: 15, // Espaçamento vertical
        paddingHorizontal: 15, // Espaçamento horizontal
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Cor da sombra para iOS
        shadowOffset: { width: 0, height: 2 }, // Offset da sombra
        shadowOpacity: 0.3, // Opacidade da sombra
        shadowRadius: 4, // Raio da sombra
    },
    headerTitle: {
        color: '#ECF0F1', // Cor do texto do cabeçalho
        fontSize: 28, // Tamanho do texto
        fontWeight: 'bold', // Negrito
        textAlign: 'left', // Centraliza o título
        paddingLeft: 15, // Margem inferior
    },
    searchInput: {
        height: 40,
        borderColor: '#ECF0F1',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#34495E', // Cor de fundo do campo de busca
        color: '#fff', // Cor do texto
        placeholderTextColor: '#fff',
    },
    categoryContainer: {
        flexDirection: 'row', // Alinha os itens em linha
        justifyContent: 'space-around', // Espaço entre os itens
        marginTop: 10, // Margem superior para separar do título
    },
    categoryText: {
        color: '#ECF0F1', // Cor do texto das categorias
        fontSize: 16, // Tamanho do texto
        textAlign: 'center', // Centraliza o texto
        paddingVertical: 5, // Espaçamento vertical em cada botão
    },
    imageContainer: {
        alignItems: 'center', // Centraliza horizontalmente
        backgroundColor: '#000', // Cor de fundo das imagens
        paddingTop: 25, // Espaçamento interno
    },
    movieImage: {
        width: '88%', // A imagem ocupa 90% da largura da tela
        height: 560, // Altura fixa da imagem
    },
});

export default HomeScreen;
