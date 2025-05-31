import React, { useState, useRef } from 'react';
import { config } from '../config/config';

/**
 * 이미지 업로드 컴포넌트
 * - 이미지 파일 선택, 미리보기, 삭제 기능 제공
 * - 드래그 앤 드롭 지원
 * @param {Function} onImageChange - 이미지 파일 변경 시 호출되는 콜백 함수
 * @param {string} className - 추가 CSS 클래스명
 */
const ImageUpload = ({ onImageChange, className = '' }) => {
    // 선택된 이미지 파일 상태
    const [selectedImage, setSelectedImage] = useState(null);
    // 미리보기 이미지 URL 상태 
    const [previewUrl, setPreviewUrl] = useState(null);
    // 드래그 오버 상태 (드래그 앤 드롭 시각적 피드백용)
    const [isDragOver, setIsDragOver] = useState(false);

    // 파일 입력 요소에 대한 참조 (프로그래밍 방식으로 클릭 트리거하기 위함)
    const fileInputRef = useRef(null);

    /**
     * 파일 유효성 검사 함수 (설정 파일 기반)
     * @param {File} file - 검사할 파일 객체
     * @returns {boolean} 유효한 파일인지 여부
     */
    const validateFile = (file) => {
        // 설정에서 허용된 이미지 타입과 최대 크기 가져오기
        const { allowedImageTypes, maxFileSize } = config.upload;

        // 파일 타입 검사
        if (!allowedImageTypes.includes(file.type)) {
            const allowedExtensions = config.upload.allowedImageExtensions.join(', ');
            alert(`지원되지 않는 파일 형식입니다. ${allowedExtensions} 파일만 업로드 가능합니다.`);
            return false;
        }

        // 파일 크기 검사
        if (file.size > maxFileSize) {
            const maxSizeMB = maxFileSize / (1024 * 1024);
            alert(`파일 크기가 너무 큽니다. ${maxSizeMB}MB 이하의 파일만 업로드 가능합니다.`);
            return false;
        }

        return true;
    };

    /**
     * 이미지 파일 처리 함수 (파일 선택 및 드롭 시 공통 로직)
     * @param {File} file - 처리할 이미지 파일
     */
    const handleImageFile = (file) => {
        // 파일 유효성 검사
        if (!validateFile(file)) {
            return;
        }

        // 선택된 파일 상태 업데이트
        setSelectedImage(file);

        // FileReader를 사용하여 미리보기 URL 생성
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file); // 파일을 Data URL로 읽기

        // 부모 컴포넌트에 파일 변경 알림
        if (onImageChange) {
            onImageChange(file);
        }
    };

    /**
     * 파일 입력 change 이벤트 핸들러
     * @param {Event} e - change 이벤트 객체
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // 첫 번째 선택된 파일만 처리
        if (file) {
            handleImageFile(file);
        }
    };

    /**
     * 이미지 삭제 핸들러
     */
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);

        // 파일 입력 요소 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // 부모 컴포넌트에 삭제 알림 (null 전달)
        if (onImageChange) {
            onImageChange(null);
        }
    };

    /**
     * 파일 선택 버튼 클릭 핸들러
     */
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    /**
     * 드래그 오버 이벤트 핸들러 (드래그 앤 드롭)
     * @param {DragEvent} e - 드래그 이벤트 객체
     */
    const handleDragOver = (e) => {
        e.preventDefault(); // 기본 드래그 동작 방지
        setIsDragOver(true); // 드래그 오버 상태 활성화
    };

    /**
     * 드래그 리브 이벤트 핸들러
     * @param {DragEvent} e - 드래그 이벤트 객체
     */
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false); // 드래그 오버 상태 비활성화
    };

    /**
     * 드롭 이벤트 핸들러 (파일 드롭 시)
     * @param {DragEvent} e - 드롭 이벤트 객체
     */
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        // 드롭된 파일 목록에서 첫 번째 파일 가져오기
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    };

    /**
     * 파일 크기를 사람이 읽기 쉬운 형태로 변환
     * @param {number} bytes - 바이트 단위 크기
     * @returns {string} 변환된 크기 문자열
     */
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // 설정에서 허용되는 파일 정보 문자열 생성
    const getAllowedFileInfo = () => {
        const extensions = config.upload.allowedImageExtensions.join(', ');
        const maxSizeMB = config.upload.maxFileSize / (1024 * 1024);
        return `${extensions} 파일 (최대 ${maxSizeMB}MB)`;
    };

    return (
        <div className={`image-upload-container ${className}`}>
            {/* 숨겨진 파일 입력 요소 */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={config.upload.allowedImageTypes.join(',')} // 설정에서 허용되는 타입 가져오기
                style={{ display: 'none' }} // 화면에 표시하지 않음
            />

            {/* 미리보기 이미지가 있는 경우 */}
            {previewUrl ? (
                <div className="image-preview-container">
                    <div className="image-preview">
                        <img
                            src={previewUrl}
                            alt="미리보기"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    {/* 선택된 파일 정보 표시 */}
                    <div className="file-info">
                        <p><strong>파일명:</strong> {selectedImage?.name}</p>
                        <p><strong>크기:</strong> {selectedImage && formatFileSize(selectedImage.size)}</p>
                        <p><strong>타입:</strong> {selectedImage?.type}</p>
                    </div>

                    {/* 이미지 변경/삭제 버튼 */}
                    <div className="image-actions">
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="btn-change-image"
                        >
                            📷 이미지 변경
                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="btn-remove-image"
                        >
                            🗑️ 이미지 삭제
                        </button>
                    </div>
                </div>
            ) : (
                /* 이미지가 선택되지 않은 경우 업로드 영역 */
                <div
                    className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                    style={{
                        border: `2px dashed ${isDragOver ? '#007bff' : '#ddd'}`,
                        borderRadius: '8px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragOver ? '#f8f9fa' : '#fafafa',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div className="upload-content">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                            이미지를 선택하거나 드래그하세요
                        </h3>
                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                            {getAllowedFileInfo()}
                        </p>
                        <button
                            type="button"
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            파일 선택
                        </button>
                    </div>
                </div>
            )}

            {/* CSS 스타일 정의 */}
            <style jsx>{`
        .image-upload-container {
          width: 100%;
          margin: 16px 0;
        }

        .image-preview-container {
          text-align: center;
        }

        .image-preview {
          margin-bottom: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px;
          background: white;
        }

        .file-info {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          text-align: left;
        }

        .file-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #555;
        }

        .image-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-change-image, .btn-remove-image {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .btn-change-image {
          background-color: #007bff;
          color: white;
        }

        .btn-change-image:hover {
          background-color: #0056b3;
        }

        .btn-remove-image {
          background-color: #dc3545;
          color: white;
        }

        .btn-remove-image:hover {
          background-color: #c82333;
        }

        .upload-area:hover {
          border-color: #007bff !important;
          background-color: #f8f9fa !important;
        }
      `}</style>
        </div>
    );
};

export default ImageUpload; 