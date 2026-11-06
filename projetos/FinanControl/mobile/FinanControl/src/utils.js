//Este arquivo é para colocar funções e variáveis que serão usadas em mais de um lugar do projeto, para evitar repetição de código. 
// Por exemplo, a variável enderecoServidor, que é o endereço do servidor backend, pode ser usada em todas as requisições para o backend, assim se precisar mudar o endereço do servidor, basta mudar aqui e não em todas as requisições.
// 
import AsyncStorage from "@react-native-async-storage/async-storage";

export const enderecoServidor = 'https://apifinancontrol-phi.vercel.app'

export const buscarUsuarioLogado = async () => {
    const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
    if (usuarioLogado) {
        return JSON.parse(usuarioLogado);
    }else {
        return null;
    }
};

export const listaCores = [
    '#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#33A1FF',
    '#8D33FF', '#FF33EC', '#FF33A1', '#33FFF6', '#FF7F50'
];

export const listaIcones = [
    'restaurant', 'directions-car', 'school', 'home', 'sports-soccer',
    'shopping-cart', 'pets', 'favorite', 'fitness-center', 'wallet'
];