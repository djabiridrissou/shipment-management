import React, { useState, useNavigate } from "react";
import { Button, Card, Pagination } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import UploadFilesModal from "../components/UploadFilesModal";
import dayjs from "dayjs";
import { useDeleteOneMutation, useFetchFilesQuery } from "../redux/features/api/apiSlice";
import Swal from "sweetalert2";

interface Shipment {
  _id: string;
  id: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useFetchFilesQuery(
    { page: currentPage, limit: pageSize },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteOne] = useDeleteOneMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaginationChange = (page: number, limit: number) => {
    setCurrentPage(page);
    setPageSize(limit);
  };

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    // Afficher une boîte de dialogue de confirmation avec SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    // Si l'utilisateur confirme, procéder à la suppression
    if (result.isConfirmed) {
      try {
        await deleteOne(id).unwrap(); // Appeler la mutation de suppression
        refetch(); // Rafraîchir les données après suppression
        Swal.fire("Deleted!", "The shipment has been deleted.", "success"); // Afficher une notification de succès
      } catch (error) {
        console.error("Error deleting shipment:", error);
        Swal.fire("Error!", "Something went wrong. Please try again.", "error"); // Afficher une notification d'erreur
      }
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Shipment Management</h1>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="flex items-center gap-2 bg-black text-white hover:bg-black/80"
          onClick={handleUploadClick}
        >
          <span className="hidden md:block">Upload</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 overflow-auto mb-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center w-full py-8">
            <h2 className="text-xl font-semibold text-gray-600">No shipments found.</h2>
            <p className="text-sm text-gray-500">It seems there are no shipments available at the moment. Please upload some files.</p>
          </div>
        ) : (
          data?.data?.map((shipment: Shipment, index: number) => (
            <Card
              key={shipment._id}
              className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 relative"
              title={`Shipment ${index + 1 + (currentPage - 1) * pageSize}`}
              onClick={() => { localStorage.setItem("shipmentId", shipment._id); navigate("/shipment"); }}
              hoverable
            >
              <div className="text-center mb-4">
                <h4>{`Shipment ${index + 1 + (currentPage - 1) * pageSize}`}</h4>
                <p className="text-sm text-gray-500">
                  {`Loaded at: ${dayjs(shipment.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}
                </p>
              </div>

              {/* Icône de suppression */}
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation(); // Empêche le clic de se propager à la carte
                  handleDelete(shipment.id.toString());
                }}
                className="absolute top-2 right-2 text-red-600 cursor-pointer"
                style={{ fontSize: '20px' }}
              />
            </Card>
          ))
        )}
      </div>

      {data?.pagination && (
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.pagination.totalCount}
            onChange={handlePaginationChange}
            showSizeChanger
            pageSizeOptions={['1', '10', '20', '30']}
            className="mt-4"
          />
        </div>
      )}

      {isModalOpen && <UploadFilesModal onClose={handleModalClose} />}
    </div>
  );
};

export default Dashboard;