import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function BatismoProfissao() {
    return (
        <GenericScreen
            apiPath="batismo-profissao"
            itemName="Batismo/Profissão de Fé"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "Batismo/Profissão de Fé"
            }}
            modalTitle="Editar Data de Batismo/Profissão de Fé"
            withNomeOnModal={true}
        />
    );
};