import React, { useState, useEffect } from 'react';
import { AlertMessage, AlertMessageButtonGroup, AlertMessageButton } from '../../assets/global/style';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import profile_api from '../../services/profile_api';
import { withRouter } from 'react-router-dom';
import { FaShower, FaChartBar, FaEdit, FaArrowLeft, FaSyncAlt, FaDatabase, FaInfo, FaEraser, FaPen } from 'react-icons/fa';
import { Abas, ContainerExclusao } from './style';

import {logout} from '../../services/auth';

import NavbarDashboard from '../../components/NavbarDashboard';
import FormDados from '../../components/FormDados';
import PainelBanho from '../../components/PainelBanho';
import ModalExclusao from '../../components/ModalExclusao';
import StatsBanho from '../../components/StatsBanho';
import HistBanho from '../../components/HistBanho';

import shower_api from '../../services/shower_api';
import getError from '../../helpers/handleErrors';

function Dashboard(props) {

    const [key, setKey] = useState('banho');
    const [perfil, setPerfil] = useState({});
    const [loading, setLoading] = useState({ status: true, mensagem: 'Carregando sessão. Aguarde...' });
    const [erro, setErro] = useState({ status: null, mensagem: null });

    const [modalShow, setModalShow] = useState(false);

    function finalizarBanho() {
        shower_api.post('finalizar')
            .then(()=> console.info("Histórico atualizado. "))
            .catch(err => {
              console.error(getError(err));
            })
    }

    useEffect(() => {
        finalizarBanho();
        
        const carregarPerfil = async () => {
            const perfil = await profile_api.get(`${props.location.state}`);
            return perfil.data;
        }

        carregarPerfil()
            .then(perfil => {
                setPerfil(perfil);
                setLoading({ status: false, mensagem: '' });
            })
            .catch(err => {
                setErro({ status: true, mensagem: `Erro ao comunicar-se com o servidor de perfis.`, descricao: getError(err) });
                setLoading({ status: false, mensagem: '' });
                logout();
                if(err.response) {
                    if(err.response.status === 403) {
                        props.history.push({ pathname: '/perfis', mensagem: err.response.data });
                    }
                } else {
                    props.history.push('/');
                }
            })

    }, [props]);

    return (
        <>

            {loading.status ?
                (<AlertMessage variant="primary"><AlertMessage.Heading>{loading.mensagem}</AlertMessage.Heading></AlertMessage>) :
                erro.status ?
                    (<AlertMessage variant="danger">
                        <AlertMessage.Heading>
                            {erro.mensagem}
                        </AlertMessage.Heading>
                        <div className="text-muted">
                            {erro.descricao}
                        </div>
                        <AlertMessageButtonGroup>
                            <AlertMessageButton variant="danger" onClick={() => props.history.push('/')}>
                                <span><FaArrowLeft /> VOLTAR</span>
                            </AlertMessageButton>
                            <AlertMessageButton variant="dark" onClick={() => window.location.reload()}>
                                <span><FaSyncAlt /> REPETIR</span>
                            </AlertMessageButton>
                        </AlertMessageButtonGroup>
                    </AlertMessage>) :
                    <>
                        <NavbarDashboard perfil={perfil} history={props.history} />
                        <ModalExclusao perfil={perfil} show={modalShow} onHide={()=> setModalShow(!modalShow)} history={props.history} />

                        <div className="container container-fluid text-center">

                            <Abas className="bg-secondary nav nav-tabs nav-justified" activeKey={key} onSelect={k => setKey(k)}>
                                <Tab eventKey="banho" title={<FaShower size={30} />}>
                                    BANHO
                                    <hr className="hr bg-white" />
                                    <PainelBanho history={props.history} perfil={perfil} />
                                </Tab>
                                <Tab eventKey="informacoes" title={<FaInfo size={30} />}>
                                    INFORMAÇÕES
                                    <hr className="hr bg-white" />
                                    <Accordion>
                                        <Accordion.Toggle block as={Button} variant="primary" eventKey="0">
                                            <span><FaDatabase /> MEU HISTÓRICO</span>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <HistBanho perfil={perfil}/>
                                        </Accordion.Collapse>
                                        <Accordion.Toggle block as={Button} variant="dark" eventKey="1">
                                            <span><FaChartBar /> ESTATÍSTICAS</span>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="1">
                                            <StatsBanho perfil={perfil} />
                                        </Accordion.Collapse>
                                    </Accordion>
                                </Tab>
                                <Tab eventKey="dados" title={<FaEdit size={30} />} >
                                    MEUS DADOS
                                    <hr className="hr bg-white" />
                                    <Accordion>
                                        <Accordion.Toggle block as={Button} variant="danger" eventKey="0">
                                            <span><FaEraser /> EXCLUIR PERFIL</span>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <ContainerExclusao>
                                                <p>
                                                    Aqui você poderá excluir o seu perfil. 
                                                    Ao fazer isso, todos os seus dados serão apagados, inclusive seu histórico.
                                                    Esta ação não poderá ser desfeita.
                                                </p>
                                                <Button variant="danger" onClick={()=> setModalShow(!modalShow)}>Eu quero excluir meu perfil</Button>
                                            </ContainerExclusao>
                                        </Accordion.Collapse>
                                        <Accordion.Toggle block as={Button} variant="info" eventKey="1">
                                            <span><FaPen /> ATUALIZAR INFORMAÇÕES</span>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="1">
                                            <FormDados action="update" perfil={perfil} />
                                        </Accordion.Collapse>
                                    </Accordion> 
                                </Tab>
                            </Abas>
                        </div>
                    </>
            }

        </>
    );
}

export default withRouter(Dashboard);