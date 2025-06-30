import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function Estudo() {
    return (
        <GenericScreen
            apiPath="estudo"
            itemName="Estudo"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "estudo"
            }}
            modalTitle="Editar Data de Estudo"
            withNomeOnModal={true}
        />
    );
};