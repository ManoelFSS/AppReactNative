import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { getMoviesFromDBMovies } from '../services/api';

const DetailsScreen = ({ route }) => {
    const { movie } = route.params; // Obtém o filme da navegação
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true); // Indicador de carregamento

    // Montando a URL correta com o movie.id
    const url = `https://api.themoviedb.org/3/movie/${movie.id}/similar?language=pt-US&page=1`;

    useEffect(() => {
        // Chama a função para buscar filmes similares
        const fetchSimilarMovies = async () => {
            try {
                setLoading(true); // Inicia o carregamento
                const similar = await getMoviesFromDBMovies(url); // Passe a URL completa
                setSimilarMovies(similar);
            } catch (error) {
                console.error('Erro ao buscar filmes similares:', error);
            } finally {
                setLoading(false); // Termina o carregamento
            }
        };

        fetchSimilarMovies();
    }, [movie.id]);

    // Renderiza cada item do carrossel
    const renderItem = ({ item }) => (
        <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
            style={styles.similarImage}
        />
    );

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: movie.backdrop_path }} style={styles.image} />
            <Text style={styles.releaseDate}>{new Date(movie.release_date).getFullYear()}</Text>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
            <Text style={styles.similarTitle}>Related</Text>

            {loading ? ( // Exibe indicador de carregamento enquanto busca os filmes
                <ActivityIndicator size="large" color="#ffffff" />
            ) : (
                <FlatList
                    data={similarMovies}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContainer}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'black',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    overview: {
        marginTop: 20,
        color: 'white',
    },
    releaseDate: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 20,
        color: 'white',
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
        color: 'white',
    },
    similarImage: {
        width: 100,  // Largura do poster
        height: 150, // Altura do poster
        marginRight: 10, // Espaçamento entre as imagens
        borderRadius: 5,
    },
    carouselContainer: {
        paddingVertical: 10, // Espaçamento vertical do carrossel
    },
});

export default DetailsScreen;
