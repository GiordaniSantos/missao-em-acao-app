import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function Discipulado() {
    return (
        <GenericScreen
            apiPath="discipulado"
            itemName="Discipulado"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Nome do Discipulado"}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "discipulado",
                textoNome: "Nome: "
            }}
            modalTitle="Editar Data de Discipulado"
            withNomeOnModal={true}
        />
    );
};