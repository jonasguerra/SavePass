import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Header } from '../../components/Header';
import { LoginDataItem } from '../../components/LoginDataItem';
import { SearchBar } from '../../components/SearchBar';
import {
  Container,
  LoginList,
  Metadata,
  Title,
  TotalPassCount
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] =
    useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = '@savepass:logins';
    // Get asyncStorage data, use setSearchListData and setData
    // do asyncStorage deve ser feito um PARSE, para converter os dados em um dict
    const response = await AsyncStorage.getItem(dataKey);
    const data: LoginDataProps[] = response
      ? JSON.parse(response)
      : [];

    setData(data);
    setSearchListData(data);
  }

  function handleFilterLoginData() {
    // Filter results inside data, save with setSearchListData
    if (searchText != '')
      setSearchListData(
        data.filter((element) => element.service_name === searchText)
      );
    else setSearchListData(data);
  }

  function handleChangeInputText(text: string) {
    // Update searchText value
    setSearchText(text);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <>
      <Header
        user={{
          name: 'Rocketseat',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg',
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(
                  2,
                  '0'
                )} ao total`
              : 'Nada a ser exibido'}
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return (
              <LoginDataItem
                service_name={loginData.service_name}
                email={loginData.email}
                password={loginData.password}
              />
            );
          }}
        />
      </Container>
    </>
  );
}
