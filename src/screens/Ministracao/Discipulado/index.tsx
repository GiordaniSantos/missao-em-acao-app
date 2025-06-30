import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function Discipulado() {
    return (
        <GenericScreen
            apiPath="discipulado"
            itemName="Discipulado"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "discipulado"
            }}
            modalTitle="Editar Data de Discipulado"
            withNomeOnModal={true}
        />
    );
};