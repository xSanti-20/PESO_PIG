import DataTable from "./DataTable"
import ModalDialog from "./ModalDialog"

function ContentPage({
  TitlePage,
  Data,
  TitlesTable,
  FormPage,
  onDelete,
  onUpdate,
  endpoint,
  isModalOpen,
  setIsModalOpen,
  refreshData,
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{TitlePage}</h1>
      <div className="mb-5">
        <ModalDialog FormPage={FormPage} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </div>
      <DataTable
        Data={Data}
        TitlesTable={TitlesTable}
        onDelete={onDelete}
        onUpdate={onUpdate}
        endpoint={endpoint}
        refreshData={refreshData}
      />
    </div>
  )
}

export default ContentPage
