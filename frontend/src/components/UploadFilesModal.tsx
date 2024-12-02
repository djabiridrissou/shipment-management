import React, { useState } from "react";
import { Modal, Button, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useUploadFilesMutation } from "../redux/features/api/apiSlice";
import Swal from "sweetalert2";

interface UploadFilesModalProps {
  onClose: () => void;
}

const UploadFilesModal: React.FC<UploadFilesModalProps> = ({ onClose }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadFiles, { isLoading }] = useUploadFilesMutation();

  const handleFileChange = (info: any) => {
    let files = [...info.fileList];
    setFileList(files);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No files selected",
        text: "Please select files to upload.",
      });
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response: any = await uploadFiles(formData).unwrap();
      
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: response.message,
        });
      }

      if (response.invalidFiles && response.invalidFiles.length > 0) {
        let invalidFilesMessage = response.invalidFiles
          .map((file: { fileName: string; error: string }) => {
            return `${file.fileName}: ${file.error}`;
          })
          .join("\n");

        Swal.fire({
          icon: "warning",
          title: "Some files are invalid",
          text: invalidFilesMessage,
          showConfirmButton: true,
        });
      }
      
      if (response.errors && response.errors.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Errors occurred during upload",
          text: response.errors.join("\n"),
          showConfirmButton: true,
        });
      }

      setFileList([]);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while uploading the files.",
      });
    }
    onClose();
  };

  return (
    <Modal
      title="Upload Files"
      open={true}
      onCancel={onClose}
      footer={null}
      className="max-w-lg"
    >
      <Upload.Dragger
        multiple
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false} // Prevent automatic upload
        accept=".json"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Drag and drop files here, or click to select files</p>
        <p className="ant-upload-hint">
          You can upload multiple files. Only JSON files are supported.
        </p>
      </Upload.Dragger>

      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button type="primary" onClick={handleUpload} loading={isLoading} disabled={fileList.length === 0}>
          Upload
        </Button>
      </div>
    </Modal>
  );
};

export default UploadFilesModal;