// // MovementsScreen.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, TextInput, FlatList, TouchableOpacity,
//   Modal, StyleSheet, ActivityIndicator, Alert, Platform
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { Button } from 'react-native-paper';
// import NetInfo from '@react-native-community/netinfo';
// import { format } from 'date-fns';
// import { TextInputMask } from 'react-native-masked-text';
// import { printToFileAsync } from 'expo-print';
// import XLSX from 'xlsx';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// interface PlanoConta {
//   codigo: number;
//   tipo: string;
//   descricao: string;
// }

// interface Cliente {
//   nome: string;
//   cpf: string;
// }

// interface Procedimento {
//   codigo: string;
//   descricao: string;
// }

// interface Profissional {
//   nome: string;
//   especialidade: string;
//   conselho: string;
// }

// interface Item {
//   procedimento: Procedimento;
//   profissional: Profissional;
// }

// interface Movimento {
//   idMovimentacao: number;
//   numeroLancamento: number;
//   dataLancamento: string;
//   planoConta: PlanoConta;
//   idVenda: number;
//   dataPag: string;
//   valorVenda: number;
//   formaPagamento: string;
//   cliente: Cliente;
//   itens: Item[];
// }

// const STORAGE_KEY = '@movimentacoes_local';

// const MovementsScreen: React.FC = () => {
//   const [dados, setDados] = useState<Movimento[]>([]);
//   const [filtrados, setFiltrados] = useState<Movimento[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [erro, setErro] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [movimentoSelecionado, setMovimentoSelecionado] = useState<Movimento | null>(null);
//   const [idFiltro, setIdFiltro] = useState('');
//   const [planoFiltro, setPlanoFiltro] = useState('');
//   const [dataInicio, setDataInicio] = useState('');
//   const [dataFim, setDataFim] = useState('');
//   const [isOffline, setIsOffline] = useState(false);


//     const abrirModal = (mov: Movimento) => {
//     setMovimentoSelecionado(mov);
//     setModalVisible(true);
//   };
//     const fecharModal = () => {
//     setModalVisible(false);
//     setMovimentoSelecionado(null);
//   };

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsOffline(!state.isConnected);
//     });
//     carregarLocalmente();
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     filtrarDados();
//   }, [idFiltro, planoFiltro, dataInicio, dataFim, dados]);

//   const carregarLocalmente = async () => {
//     try {
//       const local = await AsyncStorage.getItem(STORAGE_KEY);
//       if (local) {
//         const json = JSON.parse(local);
//         setDados(json);
//       }
//     } catch (err) {
//       console.log('Erro ao carregar localmente', err);
//     }
//   };

//   const limparArmazenamento = async () => {
//     await AsyncStorage.removeItem(STORAGE_KEY);
//     setDados([]);
//     Alert.alert('Limpeza concluída', 'Todos os dados foram removidos.');
//   };

//   const sincronizar = async () => {
//     try {
//       setLoading(true);
//       const { data: novos } = await axios.get<Movimento[]>('http://160.20.22.99:5290/');
//       console.log('Dados recebidos da API:', novos);
//       const local = await AsyncStorage.getItem(STORAGE_KEY);
//       console.log("lOCAL: ",local)
//       const armazenados: Movimento[] = local ? JSON.parse(local) : [];
//       console.log("ARMAZENADOS ",armazenados)

//       const novosUnicos = novos.filter(
//         novo => !armazenados.some(antigo => antigo.idMovimentacao === novo.idMovimentacao)
//       );

//       const atualizados = [...armazenados, ...novosUnicos];
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
//       setDados(atualizados);
//       Alert.alert('Sucesso', `Foram adicionadas ${novosUnicos.length} novas movimentações.`);
//     } catch (err) {
//       setErro('Erro ao sincronizar dados.');
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filtrarDados = () => {
//     const formatDate = (str: string) => {
//       const [dia, mes, ano] = str.split('/');
//       return `${ano}-${mes}-${dia}`;
//     };

//     const resultado = dados.filter((mov) => {
//       const idMatch = idFiltro ? mov.idMovimentacao.toString().includes(idFiltro) : true;
//       const planoMatch = planoFiltro
//         ? mov.planoConta?.descricao.toLowerCase().includes(planoFiltro.toLowerCase()) ||
//           mov.planoConta?.codigo.toString().includes(planoFiltro)
//         : true;

//       const data = new Date(mov.dataLancamento);
//       const inicio = dataInicio ? new Date(formatDate(dataInicio)) : null;
//       const fim = dataFim ? new Date(formatDate(dataFim)) : null;
//       const dataMatch = (!inicio || data >= inicio) && (!fim || data <= fim);

//       return idMatch && planoMatch && dataMatch;
//     });

//     setFiltrados(resultado);
//   };

// const exportarPDF = async () => {
//   const html = `
//     <h1>Movimentações</h1>
//     <ul>
//       ${filtrados.map(item => `
//         <li>ID: ${item.idMovimentacao} - Cliente: ${item.cliente.nome} - Valor: R$ ${item.valorVenda.toFixed(2)}</li>
//       `).join('')}
//     </ul>
//   `;

//   const { uri } = await printToFileAsync({ html });
//   await Sharing.shareAsync(uri);
// };


//   const exportarExcel = async () => {
//     const ws = XLSX.utils.json_to_sheet(filtrados);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Movimentacoes');
//     const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
//     const fileUri = FileSystem.cacheDirectory + 'movimentacoes.xlsx';
//     await FileSystem.writeAsStringAsync(fileUri, wbout, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     await Sharing.shareAsync(fileUri);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.titulo}>Movimentações Contábeis</Text>
//       {isOffline && <Text style={styles.offline}>⚠ Você está offline</Text>}

//       <View style={styles.botoesAcoes}>
//         <Button onPress={exportarPDF} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Exportar PDF</Button>
//         <Button onPress={exportarExcel} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Exportar Excel</Button>
//         <Button onPress={limparArmazenamento} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Limpar Local</Button>
//         <Button onPress={sincronizar} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Sincronizar</Button>
//       </View>

//       <View style={styles.filtros}>
//         <TextInput
//           style={styles.input}
//           placeholder="ID da movimentação"
//           value={idFiltro}
//           onChangeText={setIdFiltro}
//           keyboardType="numeric"
//           placeholderTextColor="#999"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Plano de contas"
//           value={planoFiltro}
//           onChangeText={setPlanoFiltro}
//           placeholderTextColor="#999"
//         />
//         <TextInputMask
//           type={'datetime'}
//           options={{ format: 'DD/MM/YYYY' }}
//           style={styles.input}
//           placeholder="Data inicial"
//           value={dataInicio}
//           onChangeText={setDataInicio}
//           placeholderTextColor="#999"
//         />
//         <TextInputMask
//           type={'datetime'}
//           options={{ format: 'DD/MM/YYYY' }}
//           style={styles.input}
//           placeholder="Data final"
//           value={dataFim}
//           onChangeText={setDataFim}
//           placeholderTextColor="#999"
//         />
//       </View>

//       <View style={styles.botoesAcoes}>
//         <Button onPress={sincronizar} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>
//           Sincronizar
//         </Button>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#00913D" style={styles.loading} />
//       ) : erro ? (
//         <Text style={styles.erro}>{erro}</Text>
//       ) : filtrados.length === 0 ? (
//         <Text style={styles.vazio}>Nenhuma movimentação encontrada.</Text>
//       ) : (
//         <FlatList
//           data={filtrados}
//           keyExtractor={(item) => item.idMovimentacao.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => abrirModal(item)} style={styles.card}>
//               <Text style={styles.label}>📄 ID: {item.idMovimentacao}</Text>
//               <Text style={styles.label}>Data: {format(new Date(item.dataLancamento), 'dd/MM/yyyy')}</Text>
//               <Text style={styles.label}>Plano: {item.planoConta?.descricao}</Text>
//               <Text style={styles.label}>Cliente: {item.cliente?.nome}</Text>
//               <Text style={styles.label}>Valor: R$ {item.valorVenda?.toFixed(2)} 💼</Text>
//             </TouchableOpacity>
//           )}
//         />
//       )}

//       <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={fecharModal}>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContent}>
//             {movimentoSelecionado && (
//               <>
//                 <Text style={styles.modalTitle}>Detalhes da Movimentação</Text>
//                 <Text style={styles.modalItem}>ID: {movimentoSelecionado.idMovimentacao}</Text>
//                 <Text style={styles.modalItem}>Data: {movimentoSelecionado.dataLancamento}</Text>
//                 <Text style={styles.modalItem}>Cliente: {movimentoSelecionado.cliente?.nome}</Text>
//                 <Text style={styles.modalItem}>CPF: {movimentoSelecionado.cliente?.cpf}</Text>
//                 <Text style={styles.modalItem}>Plano: {movimentoSelecionado.planoConta?.descricao}</Text>
//                 {movimentoSelecionado.itens?.map((item, idx) => (
//                   <View key={idx} style={styles.itemBox}>
//                     <Text>Procedimento: {item.procedimento?.descricao}</Text>
//                     <Text>Profissional: {item.profissional?.nome}</Text>
//                     <Text>Conselho: {item.profissional?.conselho}</Text>
//                   </View>
//                 ))}
//                 <Button onPress={fecharModal} style={styles.modalButton} labelStyle={styles.botaoTexto}>
//                   Fechar
//                 </Button>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 18,
//     backgroundColor: '#FFFFFF',
//   },
//   titulo: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//     color: '#222',
//   },
//   offline: {
//     backgroundColor: '#FFC107',
//     color: '#000',
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   botoesAcoes: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 12,
//   },
//   botaoVerde: {
//     backgroundColor: '#00913D',
//     borderRadius: 8,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   botaoTexto: {
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
//   filtros: {
//     marginBottom: 16,
//   },
//   input: {
//     backgroundColor: '#F0F0F0',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 10,
//     fontSize: 16,
//     color: '#000',
//   },
//   loading: {
//     marginTop: 30,
//   },
//   erro: {
//     color: 'red',
//     textAlign: 'center',
//   },
//   vazio: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 24,
//     fontSize: 16,
//   },
//   card: {
//     backgroundColor: '#F0FFF4',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 3,
//   },
//   label: {
//     fontSize: 15,
//     color: '#333',
//     marginBottom: 4,
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#FFF',
//     padding: 24,
//     borderRadius: 14,
//     width: '85%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//     color: '#111',
//   },
//   modalItem: {
//     marginBottom: 6,
//     fontSize: 15,
//     color: '#444',
//   },
//   itemBox: {
//     marginTop: 12,
//     backgroundColor: '#F5F5F5',
//     padding: 10,
//     borderRadius: 8,
//   },
//   modalButton: {
//     marginTop: 20,
//     backgroundColor: '#00913D',
//   },
// });

// export default MovementsScreen;
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Modal, StyleSheet, ActivityIndicator, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { format, parse } from 'date-fns';
import { TextInputMask } from 'react-native-masked-text';
import { printToFileAsync } from 'expo-print';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface PlanoConta {
  codigo: number;
  tipo: string;
  descricao: string;
}

interface Cliente {
  nome: string;
  cpf: string;
}

interface Procedimento {
  codigo: string;
  descricao: string;
}

interface Profissional {
  nome: string;
  especialidade: string;
  conselho: string;
}

interface Item {
  procedimento: Procedimento;
  profissional: Profissional;
}

interface Movimento {
  idMovimentacao: number;
  numeroLancamento: number;
  dataLancamento: string;
  planoConta: PlanoConta;
  idVenda: number;
  dataPag: string;
  valorVenda: number;
  formaPagamento: string;
  cliente: Cliente;
  itens: Item[];
}

const STORAGE_KEY = '@movimentacoes_local';

const MovementsScreen: React.FC = () => {
  const [dados, setDados] = useState<Movimento[]>([]);
  const [filtrados, setFiltrados] = useState<Movimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [movimentoSelecionado, setMovimentoSelecionado] = useState<Movimento | null>(null);
  const [idFiltro, setIdFiltro] = useState('');
  const [planoFiltro, setPlanoFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const abrirModal = (mov: Movimento) => {
    setMovimentoSelecionado(mov);
    setModalVisible(true);
  };
  const fecharModal = () => {
    setModalVisible(false);
    setMovimentoSelecionado(null);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    carregarLocalmente();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filtrarDados();
  }, [idFiltro, planoFiltro, dataInicio, dataFim, dados]);

  const carregarLocalmente = async () => {
    try {
      const local = await AsyncStorage.getItem(STORAGE_KEY);
      if (local) {
        const json = JSON.parse(local);
        setDados(json);
      }
    } catch (err) {
      console.log('Erro ao carregar localmente', err);
    }
  };

  const limparArmazenamento = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setDados([]);
    Alert.alert('Limpeza concluída', 'Todos os dados foram removidos.');
  };

  const sincronizar = async () => {
    try {
      setLoading(true);
      const { data: novos } = await axios.get<Movimento[]>('http://160.20.22.99:5290/');
      const local = await AsyncStorage.getItem(STORAGE_KEY);
      const armazenados: Movimento[] = local ? JSON.parse(local) : [];
      const novosUnicos = novos.filter(
        novo => !armazenados.some(antigo => antigo.idMovimentacao === novo.idMovimentacao)
      );
      const atualizados = [...armazenados, ...novosUnicos];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
      setDados(atualizados);
      Alert.alert('Sucesso', `Foram adicionadas ${novosUnicos.length} novas movimentações.`);
    } catch (err) {
      setErro('Erro ao sincronizar dados.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarDados = () => {
    const parseDate = (str: string) => {
      const [dia, mes, ano] = str.split('/');
      return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 0, 0, 0);
    };

    const resultado = dados.filter((mov) => {
      const idMatch = idFiltro ? mov.idMovimentacao.toString().includes(idFiltro) : true;
      const planoMatch = planoFiltro
        ? mov.planoConta?.descricao.toLowerCase().includes(planoFiltro.toLowerCase()) ||
          mov.planoConta?.codigo.toString().includes(planoFiltro)
        : true;

      const dataMov = new Date(mov.dataLancamento);
      const inicio = dataInicio ? parseDate(dataInicio) : null;
      const fim = dataFim ? parseDate(dataFim) : null;
      const dataMatch = (!inicio || dataMov >= inicio) && (!fim || dataMov <= fim);

      return idMatch && planoMatch && dataMatch;
    });

    setFiltrados(resultado);
  };

  const exportarPDF = async () => {
    const html = `
      <h1>Movimentações</h1>
      <ul>
        ${filtrados.map(item => `
          <li>ID: ${item.idMovimentacao} - Cliente: ${item.cliente.nome} - Valor: R$ ${item.valorVenda.toFixed(2)}</li>
        `).join('')}
      </ul>
    `;

    const { uri } = await printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const exportarExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(filtrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimentacoes');
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const fileUri = FileSystem.cacheDirectory + 'movimentacoes.xlsx';
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await Sharing.shareAsync(fileUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Movimentações Contábeis</Text>
      {isOffline && <Text style={styles.offline}>⚠ Você está offline</Text>}

      <View style={styles.botoesAcoes}>
        <Button onPress={exportarPDF} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Exportar PDF</Button>
        <Button onPress={exportarExcel} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Exportar Excel</Button>
        <Button onPress={limparArmazenamento} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Limpar Local</Button>
        <Button onPress={sincronizar} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>Sincronizar</Button>
        <Button onPress={() => setMostrarFiltros(prev => !prev)} style={styles.botaoVerde} labelStyle={styles.botaoTexto}>
          {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
      </View>

      {mostrarFiltros && (
        <View style={styles.filtros}>
          <TextInput
            style={styles.input}
            placeholder="ID da movimentação"
            value={idFiltro}
            onChangeText={setIdFiltro}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Plano de contas"
            value={planoFiltro}
            onChangeText={setPlanoFiltro}
            placeholderTextColor="#999"
          />
          <View style={styles.dataContainer}>
            <TextInputMask
              type={'datetime'}
              options={{ format: 'DD/MM/YYYY' }}
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              placeholder="Data inicial"
              value={dataInicio}
              onChangeText={setDataInicio}
              placeholderTextColor="#999"
            />
            <TextInputMask
              type={'datetime'}
              options={{ format: 'DD/MM/YYYY' }}
              style={[styles.input, { flex: 1, marginLeft: 5 }]}
              placeholder="Data final"
              value={dataFim}
              onChangeText={setDataFim}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#00913D" style={styles.loading} />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : filtrados.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma movimentação encontrada.</Text>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.idMovimentacao.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => abrirModal(item)} style={styles.card}>
              <Text style={styles.label}>📄 ID: {item.idMovimentacao}</Text>
              <Text style={styles.label}>Data: {format(new Date(item.dataLancamento), 'dd/MM/yyyy')}</Text>
              <Text style={styles.label}>Plano: {item.planoConta?.descricao}</Text>
              <Text style={styles.label}>Cliente: {item.cliente?.nome}</Text>
              <Text style={styles.label}>Valor: R$ {item.valorVenda?.toFixed(2)} 💼</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={fecharModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {movimentoSelecionado && (
              <>
                <Text style={styles.modalTitle}>Detalhes da Movimentação</Text>
                <Text style={styles.modalItem}>ID: {movimentoSelecionado.idMovimentacao}</Text>
                <Text style={styles.modalItem}>Data: {movimentoSelecionado.dataLancamento}</Text>
                <Text style={styles.modalItem}>Cliente: {movimentoSelecionado.cliente?.nome}</Text>
                <Text style={styles.modalItem}>CPF: {movimentoSelecionado.cliente?.cpf}</Text>
                <Text style={styles.modalItem}>Plano: {movimentoSelecionado.planoConta?.descricao}</Text>
                {movimentoSelecionado.itens?.map((item, idx) => (
                  <View key={idx} style={styles.itemBox}>
                    <Text>Procedimento: {item.procedimento?.descricao}</Text>
                    <Text>Profissional: {item.profissional?.nome}</Text>
                    <Text>Conselho: {item.profissional?.conselho}</Text>
                  </View>
                ))}
                <Button onPress={fecharModal} style={styles.modalButton} labelStyle={styles.botaoTexto}>
                  Fechar
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  offline: {
    backgroundColor: '#FFC107',
    color: '#000',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: 'center',
  },
  botoesAcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  botaoVerde: {
    backgroundColor: '#00913D',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  botaoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  filtros: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
  loading: {
    marginTop: 30,
  },
  erro: {
    color: 'red',
    textAlign: 'center',
  },
  vazio: {
    color: '#888',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#F0FFF4',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 14,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#111',
  },
  modalItem: {
    marginBottom: 6,
    fontSize: 15,
    color: '#444',
  },
  itemBox: {
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#00913D',
  },
});
export default MovementsScreen;
