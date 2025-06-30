import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function BatismoInfantil() {
    return (
        <GenericScreen
            apiPath="batismo-infantil"
            itemName="Batismo Infantil"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "Batismo Infantil"
            }}
            modalTitle="Editar Data de Batismo Infantil"
            withNomeOnModal={true}
        />
    );
};