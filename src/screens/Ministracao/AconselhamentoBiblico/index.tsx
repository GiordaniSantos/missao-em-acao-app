import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function AconselhamentoBiblico() {
    return (
        <GenericScreen
            apiPath="aconselhamento-biblico"
            itemName="Aconselhamento Biblico"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Nome do Aconselhado"}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "aconselhado",
                textoNome: "Aconselhado: "
            }}
            modalTitle="Editar Data de Aconselhamento Biblico"
            withNomeOnModal={true}
        />
    );
};