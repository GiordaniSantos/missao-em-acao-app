import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function EstudoBiblico() {
    return (
        <GenericScreen
            apiPath="estudo-biblico"
            itemName="Estudo Biblico"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Assunto do Estudo Biblico"}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "estudo",
                textoNome: "Assunto: "
            }}
            modalTitle="Editar Data de Estudo Bíblico"
            withNomeOnModal={true}
        />
    );
};