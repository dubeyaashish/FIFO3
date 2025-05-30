import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Alert,
  ListGroup,
  Badge
} from "react-bootstrap";
import {
  FaSearch,
  FaEdit,
  FaShoppingBasket,
  FaHistory,
  FaTimesCircle,
  FaPlus,
  FaFileAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaInfoCircle,
  FaTrashAlt
} from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./midnight.css";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import loadingSvg from "./Loading.svg";


const styles = {
  pageContainer: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    paddingTop: "3rem",
    paddingBottom: "2rem",
    width: "100vw",
    margin: 0,
    position: "absolute",
    left: 0,
    overflow: "hidden"
  },
  headerTitle: {
    color: "#2c3e50",
    fontWeight: "bold",
    borderBottom: "2px solid #3498db",
    paddingBottom: "0.75rem",
    marginBottom: "0.5rem",
    fontSize: "2rem"
  },
  card: {
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "none",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    marginBottom: "1.5rem"
  },
  cardHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)"
  },
  cardHeader: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    padding: "1rem 1.25rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardHeaderIcon: {
    marginRight: "0.5rem",
    color: "#3498db"
  },
  primaryButton: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
    boxShadow: "0 2px 4px rgba(52, 152, 219, 0.3)",
    transition: "all 0.2s"
  },
  secondaryButton: {
    backgroundColor: "#95a5a6",
    borderColor: "#95a5a6",
    boxShadow: "0 2px 4px rgba(149, 165, 166, 0.3)",
    transition: "all 0.2s"
  },
  dangerButton: {
    backgroundColor: "#e74c3c",
    borderColor: "#e74c3c",
    boxShadow: "0 2px 4px rgba(231, 76, 60, 0.3)",
    transition: "all 0.2s"
  },
  successButton: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
    boxShadow: "0 2px 4px rgba(46, 204, 113, 0.3)",
    transition: "all 0.2s"
  },
  buttonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
  },
  table: {
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.05)",
    borderRadius: "0.5rem",
    overflow: "hidden"
  },
  navItem: {
    margin: "0.25rem 0",
    borderRadius: "0.5rem",
    fontWeight: "500",
    transition: "all 0.3s"
  },
  navItemActive: {
    backgroundColor: "#3498db !important",
    color: "white !important",
    boxShadow: "0 2px 5px rgba(52, 152, 219, 0.5)"
  },
  sidebar: {
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: "1rem"
  },
  badge: {
    padding: "0.5em 0.75em",
    borderRadius: "30px",
    fontWeight: "normal",
    fontSize: "0.75rem"
  },
  infoBox: {
    borderLeft: "4px solid #3498db",
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    padding: "1rem",
    borderRadius: "0 0.5rem 0.5rem 0",
    marginBottom: "1rem"
  },
  paginationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1.5rem"
  },
  paginationButton: {
    display: "flex",
    alignItems: "center",
    padding: "0.4rem 0.8rem"
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    fontWeight: "600"
  },
  searchContainer: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center"
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
    marginBottom: "1rem"
  },
  dataRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "0.5rem"
  },
  dataLabel: {
    fontWeight: "600",
    color: "#7f8c8d",
    fontSize: "0.875rem",
    marginBottom: "0.25rem",
    display: "flex",
    alignItems: "center"
  },
  dataIcon: {
    marginRight: "0.5rem",
    color: "#3498db"
  },
  dataValue: {
    color: "#2c3e50",
    fontSize: "1rem"
  }
};

const pageSize = 25; // Items per page

// Custom LoadingSpinner component using SVG
const LoadingSpinner = React.memo(({ size = "60px" }) => (
  <div
    className="text-center my-4 d-flex justify-content-center align-items-center"
    style={{ height: size }}
  >
    <img src={loadingSvg} alt="Loading..." style={{ height: size, width: size }} />
  </div>
));

// Enhanced Memoized SearchInput
const SearchInput = React.memo(({ placeholder, value, onChange }) => (
  <InputGroup className="mb-3">
    <InputGroup.Text style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}>
      <FaSearch style={{ color: "#3498db" }} />
    </InputGroup.Text>
    <Form.Control
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        border: "1px solid #e9ecef",
        boxShadow: "none",
        padding: "0.6rem 1rem",
        fontSize: "0.95rem"
      }}
    />
  </InputGroup>
));

// Custom hook to debounce a value
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// --- Helper Functions for PDF Mapping (unchanged) ---
const tickSymbol = "✓";

const groupByDocumentId = (documents) =>
  documents.reduce((groups, item) => {
    if (!groups[item.document_id]) {
      groups[item.document_id] = [];
    }
    groups[item.document_id].push(item);
    return groups;
  }, {});

const getFirstNonEmptyValue = (field, items) => {
  for (let item of items) {
    if (item[field] && item[field].toString().trim() !== "") {
      return item[field].toString().trim();
    }
  }
  return "";
};

const getFirstValue = (field, items) =>
  items[0] && items[0][field] ? items[0][field].toString().trim() : "";

const formatDateField = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB");
};

const cleanString = (str) => (str ? str.toString().trim() : "");

const extractDepartment = (salecoName) => {
  if (!salecoName) return { nameWithoutDepartment: "N/A", departmentName: "N/A" };
  const keyword = "แผนก";
  const idx = salecoName.indexOf(keyword);
  if (idx !== -1) {
    const departmentName = salecoName.substring(idx + keyword.length).trim();
    const nameWithoutDepartment = salecoName.substring(0, idx).trim();
    const cleanDept = departmentName.replace(/[^a-zA-Z0-9ก-๙\s]/g, "").trim();
    return { nameWithoutDepartment, departmentName: cleanDept || "N/A" };
  }
  return { nameWithoutDepartment: salecoName, departmentName: "N/A" };
};

const SaleCoRequests = () => {
  const navigate = useNavigate();

  // Basic States
  const [searchParams, setSearchParams] = useState({ itemCode: "", serial: "" });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const [basket, setBasket] = useState([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState("requests");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [failedDocuments, setFailedDocuments] = useState([]);
  const [failedPage, setFailedPage] = useState(1);

  // New states for Store NC modal
  const [storeNCModalVisible, setStoreNCModalVisible] = useState(false);
  const [selectedStoreNCData, setSelectedStoreNCData] = useState(null);
  // New state for additional NC form fields
  const [ncFormData, setNcFormData] = useState({
    productType: "",
    lotNo: "",
    packSize: "",
    foundIssue: "",
    defectReporter: "",
    inventorySource: "",
    issueDetails: "",
    preventiveActions: "",
    ncImage1: null,
    ncImage2: null
  });

  // Form Data State
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    remark: "",
    wantDate: "",
    requestDetails: [],
    departmentExpense: ""
  });

  // Department options state for the searchable dropdown
  const [departmentOptions, setDepartmentOptions] = useState([]);

  // Custom Select Styles
  const selectStyles = {
    control: (base) => ({
      ...base,
      border: "1px solid #e9ecef",
      boxShadow: "none",
      "&:hover": { border: "1px solid #ced4da" },
      borderRadius: "0.375rem",
      padding: "0.1rem"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3498db"
        : state.isFocused
        ? "rgba(52, 152, 219, 0.1)"
        : null,
      "&:active": { backgroundColor: "rgba(52, 152, 219, 0.2)" }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(52, 152, 219, 0.1)",
      borderRadius: "4px"
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#2c3e50"
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#7f8c8d",
      "&:hover": { backgroundColor: "rgba(231, 76, 60, 0.2)", color: "#e74c3c" }
    })
  };

  // Fetch departments from the API once
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("https://saleco.ruu-d.com/departments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Failed to fetch departments");
        const data = await response.json();
        const options = data.map((dept) => ({ value: dept, label: dept }));
        setDepartmentOptions(options);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Debounced search terms
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [cancelledSearchTerm, setCancelledSearchTerm] = useState("");
  const debouncedHistorySearch = useDebounce(historySearchTerm, 300);
  const debouncedCancelledSearch = useDebounce(cancelledSearchTerm, 300);
  const [failedSearchTerm, setFailedSearchTerm] = useState("");
  const debouncedFailedSearch = useDebounce(failedSearchTerm, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedHistorySearch, debouncedCancelledSearch]);

  // Memoized function to group and slice data for pagination
  const groupAndSlice = useCallback(
    (data) =>
      Object.entries(
        data.slice((page - 1) * pageSize, page * pageSize).reduce((groups, { document_id, ...rest }) => {
          groups[document_id] = groups[document_id] || [];
          groups[document_id].push(rest);
          return groups;
        }, {})
      ),
    [page]
  );

  // Open Store NC modal and prefill with selected record data
  const handleOpenStoreNCModal = (serialData) => {
    setSelectedStoreNCData(serialData);
    // Reset NC form fields
    setNcFormData({
      productType: "",
      lotNo: "",
      packSize: "",
      foundIssue: "",
      defectReporter: "",
      inventorySource: "",
      issueDetails: "",
      preventiveActions: "",
      ncImage1: null,
      ncImage2: null
    });
    setStoreNCModalVisible(true);
  };

  // NEW: Function to upload NC images if provided, then call the backend endpoint
  // and update the status on that serial to "At Store NC"
  const handleStoreNCSubmit = async () => {
    if (!selectedStoreNCData) return;
    const sn_number = selectedStoreNCData.sn_number;
  
    try {
      // Step 1: Insert a record from SaleCoRequests into Nc_table
      // Note: Image fields are intentionally left empty at this time.
      const payload = {
        sn_number,
        userName,
        productType: ncFormData.productType,
        lotNo: ncFormData.lotNo,
        packSize: ncFormData.packSize,
        foundIssue: ncFormData.foundIssue,
        defectReporter: ncFormData.defectReporter,
        inventorySource: ncFormData.inventorySource,
        issueDetails: ncFormData.issueDetails,
        preventiveActions: ncFormData.preventiveActions,
        ncImage1: "",
        ncImage2: ""
      };
  
      const storeNCResponse = await fetch("https://saleco.ruu-d.com/sale-co/store-nc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      const storeNCData = await storeNCResponse.json();
  
      if (!storeNCResponse.ok) {
        alert("Failed to create NC record: " + storeNCData.error);
        return;
      }
  
      const newDocumentId = storeNCData.newDocumentId;
      console.log("New NC Document ID:", newDocumentId);
  
      // Step 2: Now that the record exists, upload NC images (if provided)
      let ncImage1Url = "";
      let ncImage2Url = "";
  
      if (ncFormData.ncImage1) {
        const formDataImg1 = new FormData();
        formDataImg1.append("image", ncFormData.ncImage1);
        formDataImg1.append("sn_number", sn_number);
        formDataImg1.append("type", "nc1"); // This tells your backend to update nc_image1 in Nc_table
  
        const uploadRes1 = await fetch("https://saleco.ruu-d.com/upload-image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formDataImg1
        });
        const uploadData1 = await uploadRes1.json();
        if (uploadRes1.ok) {
          ncImage1Url = uploadData1.imageUrl || "";
        } else {
          console.error("NC Image 1 upload failed:", uploadData1.error);
        }
      }
  
      if (ncFormData.ncImage2) {
        const formDataImg2 = new FormData();
        formDataImg2.append("image", ncFormData.ncImage2);
        formDataImg2.append("sn_number", sn_number);
        formDataImg2.append("type", "nc2"); // This tells your backend to update nc_image2 in Nc_table
  
        const uploadRes2 = await fetch("https://saleco.ruu-d.com/upload-image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formDataImg2
        });
        const uploadData2 = await uploadRes2.json();
        if (uploadRes2.ok) {
          ncImage2Url = uploadData2.imageUrl || "";
        } else {
          console.error("NC Image 2 upload failed:", uploadData2.error);
        }
      }
      const statusResponse = await fetch("https://saleco.ruu-d.com/sale-co/store-nc/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ sn_number, status: "At Store NC" })
      });
      const statusData = await statusResponse.json();
      if (!statusResponse.ok) {
        alert("Failed to update NC status: " + statusData.error);
        return;
      }
  
      alert("Records successfully copied into NC table.\nNew Document ID: " + newDocumentId);
      setStoreNCModalVisible(false);
      setSelectedStoreNCData(null);
    } catch (err) {
      console.error("Error in handleStoreNCSubmit:", err);
      alert("Error submitting NC request.");
    }
  };
  

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetch("https://saleco.ruu-d.com/user-details", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setUserName(data.fullName);
      setDepartment(data.department);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);

  // Memoized fetchProducts function
  const fetchProducts = useCallback(
    async (currentPage = 1) => {
      try {
        setLoadingProducts(true);
        const params = new URLSearchParams();
        if (searchParams.itemCode.trim())
          params.append("search_item_code", searchParams.itemCode.trim());
        if (searchParams.serial.trim())
          params.append("search_serial", searchParams.serial.trim());
        const url = `https://saleco.ruu-d.com/products${params.toString() ? `?${params}` : ""}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const allProducts = data.remainingSerialsDetails || [];
        setProducts(allProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize));
        setTotalItems(allProducts.length);
        setPage(currentPage);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products. Please try again.");
      } finally {
        setLoadingProducts(false);
      }
    },
    [searchParams]
  );

  const handleAddToBasket = () => {
    if (!selectedProduct || !selectedProduct.transactions?.[0]) {
      alert("Invalid product data. Cannot add to basket.");
      return;
    }
    const quantity = parseInt(document.getElementById("product-quantity").value, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please select a valid quantity.");
      return;
    }
    const existingItem = basket.find((item) => item.serial === selectedProduct.serial);
    if (existingItem) {
      existingItem.quantity += quantity;
      setBasket([...basket]);
    } else {
      const description = selectedProduct.transactions[0]["ชื่อสินค้า"] || "No Description";
      setBasket([...basket, { ...selectedProduct, quantity, description }]);
    }
    setSelectedProduct(null);
    setShowQuantityModal(false);
  };

  // Options for request details
  const requestDetailsOptions = [
    { value: "ทดสอบเครื่องล้างภาชนะใหม่", label: "ทดสอบเครื่องล้างภาชนะใหม่" },
    { value: "ทดสอบเครื่องล้างภาชนะเก่า", label: "ทดสอบเครื่องล้างภาชนะเก่า" },
    {
      value: "ปรับปรุงเครื่องล้างภาชนะเก่า Repair & Modify",
      label: "ปรับปรุงเครื่องล้างภาชนะเก่า Repair & Modify"
    },
    { value: "ตรวจสอบอุปกรณ์แถมภายในเครื่อง", label: "ตรวจสอบอุปกรณ์แถมภายในเครื่อง" },
    { value: "ทดสอบเครื่องทำความสะอาดด้านพื้น", label: "ทดสอบเครื่องทำความสะอาดด้านพื้น" },
    { value: "ทดลองใช้งานโมบาย", label: "ทดลองใช้งานโมบาย" },
    { value: "ทดสอบเครื่องจักรอุปกรณ์", label: "ทดสอบเครื่องจักรอุปกรณ์" }
  ];

  const handleRemoveFromBasket = useCallback(
    (serial) => setBasket(basket.filter((item) => item.serial !== serial)),
    [basket]
  );

  // PDF Generation Logic (unchanged)
  const generatePdf = async (documentId) => {
    try {
      if (!documentId) {
        console.error("No documentId provided!");
        return "";
      }
      // Fetch allocated items from backend
      const allocatedResponse = await fetch(`https://saleco.ruu-d.com/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!allocatedResponse.ok)
        throw new Error(`Failed to fetch allocated items. Status: ${allocatedResponse.status}`);
      const allocatedItems = await allocatedResponse.json();

      // Load the PDF template and font
      const templateUrl = `/sid/template.pdf?nocache=${Date.now()}`;
      const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(templateBytes);
      pdfDoc.registerFontkit(fontkit);

      const fontUrl = `/sid/NotoSansThai-Regular.ttf?nocache=${Date.now()}`;
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
      const thaiFont = await pdfDoc.embedFont(fontBytes, { subset: true });

      const form = pdfDoc.getForm();

      // Field mapping
      const fieldMapping = {
        want_date: "wantdate",
        customer_name: "customername",
        name: "saleco",
        timestamp: "created_at"
      };
      const DEFAULT_FONT_SIZE = 10;
      const safeSetText = (fieldName, value, fontSize = DEFAULT_FONT_SIZE) => {
        if (fieldName === "address") {
          const maxLen = 30;
          let part1 = value;
          let part2 = "";
          if (value.length > maxLen) {
            let idx = value.lastIndexOf(" ", maxLen);
            if (idx === -1) idx = maxLen;
            part1 = value.substring(0, idx);
            part2 = value.substring(idx).trim();
          }
          try {
            const addressField1 = form.getTextField("address1");
            addressField1.setFontSize(fontSize);
            addressField1.setText(part1 || "N/A");
            addressField1.updateAppearances(thaiFont);
          } catch (error) {
            console.error("Error setting field address1:", error);
          }
          try {
            const addressField2 = form.getTextField("address2");
            addressField2.setFontSize(fontSize);
            addressField2.setText(part2 || "N/A");
            addressField2.updateAppearances(thaiFont);
          } catch (error) {
            console.error("Error setting field address2:", error);
          }
          return;
        }
        const pdfFieldName = fieldMapping[fieldName] || fieldName;
        try {
          const field = form.getTextField(pdfFieldName);
          field.setFontSize(fontSize);
          field.setText(value || "N/A");
          field.updateAppearances(thaiFont);
        } catch (error) {
          console.error(`Error setting field ${pdfFieldName}:`, error);
        }
      };

      // Populate document-level fields
      safeSetText("created_at", new Date().toLocaleDateString("en-GB"));
      safeSetText("want_date", formData.wantDate ? new Date(formData.wantDate).toLocaleDateString("en-GB") : "N/A");
      safeSetText("customer_name", formData.customerName || "N/A");
      safeSetText("address", formData.customerAddress || "N/A");
      safeSetText("name", userName || "N/A");
      safeSetText("department", department || "N/A");
      safeSetText("departmentexpense", formData.departmentExpense || "-");
      safeSetText("timestamp", new Date().toLocaleDateString("en-GB"));

      // Map request details checkboxes
      const requestDetails = formData.requestDetails || [];
      if (requestDetails.includes("ทดสอบเครื่องล้างภาชนะใหม่")) safeSetText("box1", "X");
      if (requestDetails.includes("ทดสอบเครื่องล้างภาชนะเก่า")) safeSetText("box2", "X");
      if (requestDetails.includes("ปรับปรุงเครื่องล้างภาชนะเก่า Repair & Modify")) safeSetText("box3", "X");
      if (requestDetails.includes("ตรวจสอบอุปกรณ์แถมภายในเครื่อง")) safeSetText("box4", "X");
      if (requestDetails.includes("ทดสอบเครื่องทำความสะอาดด้านพื้น")) safeSetText("box5", "X");
      if (requestDetails.includes("ทดลองใช้งานโมบาย")) safeSetText("box6", "X");
      if (requestDetails.includes("ทดสอบเครื่องจักรอุปกรณ์")) safeSetText("box7", "X");
      if (formData.remark) {
        safeSetText("box8", "X");
        safeSetText("desc1", formData.remark.slice(0, 50) || "");
        if (formData.remark.length > 50) {
          safeSetText("desc2", formData.remark.slice(50, 100) || "");
        }
      }

      // Acrobat multiline handling
      const setMultilineTextAcrobat = (fieldName, value, fontSize = DEFAULT_FONT_SIZE) => {
        const pdfFieldName = fieldMapping[fieldName] || fieldName;
        try {
          const field = form.getTextField(pdfFieldName);
          field.setFontSize(fontSize);
          field.enableRichFormatting();
          field.setMultiline(true);
          field.setText(value || "N/A");
          field.updateAppearances(thaiFont);
        } catch (error) {
          console.error(`Error setting multiline field ${pdfFieldName}:`, error);
          try {
            const field = form.getTextField(pdfFieldName);
            field.setFontSize(fontSize);
            field.setText(value || "N/A");
            field.updateAppearances(thaiFont);
          } catch (fallbackError) {
            console.error(`Fallback error for field ${pdfFieldName}:`, fallbackError);
          }
        }
      };

      const calculateFontSize = (text) => {
        const length = text.length;
        if (length > 60) return 5;
        if (length > 50) return 6;
        if (length > 40) return 7;
        if (length > 25) return 7;
        return 8;
      };

      // Populate product-level fields using allocated items (limit to 5)
      allocatedItems.slice(0, 5).forEach((item, index) => {
        try {
          const itemNumberField = `fill_${25 + index * 4}`;
          const field = form.getTextField(itemNumberField);
          field.setFontSize(DEFAULT_FONT_SIZE);
          field.setText(`${index + 1}`);
          field.updateAppearances(thaiFont);
        } catch (error) {
          console.error(`Error setting field fill_${25 + index * 4}:`, error);
        }
        try {
          const productId = item.product_id || "";
          const description = item.description || item.product_description || "";
          let combinedText = "";
          if (productId && description) {
            if (description.length > 15 || (productId.length + description.length) > 25) {
              combinedText = `${productId}\u2029${description}`;
            } else {
              combinedText = `${productId} - ${description}`;
            }
          } else {
            combinedText = productId;
          }
          const fontSize = calculateFontSize(combinedText);
          setMultilineTextAcrobat(`productid${index + 1}`, combinedText, fontSize);
        } catch (error) {
          console.error(`Error processing product info for item ${index + 1}:`, error);
          safeSetText(`productid${index + 1}`, item.product_id || "", 7);
        }
        safeSetText(`serialnumber${index + 1}`, item.sn_number || "");
        safeSetText(`remark${index + 1}`, item.remark || "");
        safeSetText(`qcmremark${index + 1}`, item.QcmRemark || "-");
      });

      form.flatten();
      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

      const filename = `${documentId}.pdf`;
      const uploadData = new FormData();
      uploadData.append("pdf", blob, filename);
      uploadData.append("documentId", documentId);
      const uploadResponse = await fetch("https://saleco.ruu-d.com/upload-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: uploadData
      });
      if (!uploadResponse.ok) throw new Error("Failed to upload PDF");
      const result = await uploadResponse.json();
      return result.pdfUrl;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return "";
    }
  };

  // Request submission handler (unchanged)
  const handleRequestSubmission = async () => {
    if (basket.length === 0) {
      alert("Your basket is empty!");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        wantDate: formData.wantDate,
        requestDetails: formData.requestDetails.join(", "),
        remark: formData.remark,
        departmentExpense: formData.departmentExpense,
        userName: `${userName} แผนก ${department}`,
        items: basket.map((item) => ({
          productId: item.transactions[0]["รหัสสินค้า"],
          quantity: item.quantity,
          description: item.description
        }))
      };

      let response;
      try {
        response = await fetch("https://saleco.ruu-d.com/sale-co/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
      } catch (fetchError) {
        console.error("Network error:", fetchError);
        alert("Network connection error. Please check your connection and try again.");
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error (${response.status}):`, errorText);
        alert(`Request failed with status ${response.status}. Please try again later.`);
        return;
      }
      const result = await response.json();
      const pdfUrl = await generatePdf(result.documentId);
      const pdfMessage = pdfUrl
        ? `<b>📥 PDF เอกสาร:</b> ${pdfUrl}`
        : `<b>📄 หมายเลขเอกสาร:</b> ${result.documentId} (PDF will be available soon)`;
      const telegramMessage = `<b> 🔥New Document Created!!</b>
<b>📄 หมายเลขเอกสาร:</b> ${result.documentId}
<b>🕒 วันที่และเวลาที่สร้าง:</b> ${new Date().toLocaleString()}
<b>👤 ชื่อลูกค้า:</b> ${formData.customerName}
<b>📅 วันที่ต้องการ:</b> ${formData.wantDate || new Date().toLocaleString("en-GB")}
<b>👥 ชื่อผู้แจ้งงาน:</b> ${userName}
<b>🏢 แผนก:</b> ${department}
<b>💬 Remark:</b> ${formData.remark}
${pdfMessage}`;

      try {
        await Promise.all([
          fetch("https://api.telegram.org/bot7646625188:AAGS-NqBl3rUU9AlC9a01wzlbaqs6spBf7M/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: "-4614144690",
              text: telegramMessage,
              parse_mode: "HTML"
            })
          }),
          fetch("https://api.telegram.org/bot7646625188:AAGS-NqBl3rUU9AlC9a01wzlbaqs6spBf7M/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: "-4631636900",
              text: telegramMessage,
              parse_mode: "HTML"
            })
          })
        ]);
      } catch (telegramError) {
        console.error("Error sending Telegram message:", telegramError);
      }

      setShowSuccessMessage(true);
      setBasket([]);
      setShowRequestModal(false);
      fetchProducts(1);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = useCallback(() => fetchProducts(1), [fetchProducts]);
  const handleReset = useCallback(() => {
    setSearchParams({ itemCode: "", serial: "" });
    fetchProducts(1);
  }, [fetchProducts]);
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= Math.ceil(totalItems / pageSize)) {
        fetchProducts(newPage);
      }
    },
    [totalItems, fetchProducts]
  );

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await fetch("https://saleco.ruu-d.com/sale-co/history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) throw new Error("Failed to fetch transaction history");
      const data = await response.json();
      setTransactionHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      alert("Failed to fetch transaction history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchFailedDocuments = async () => {
    try {
      const response = await fetch("https://saleco.ruu-d.com/sale-co/failed-qc", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) throw new Error("Failed to fetch failed QC documents");
      const data = await response.json();
      setFailedDocuments(data);
    } catch (error) {
      console.error("Error fetching failed QC documents:", error);
    }
  };

  const handleCancelDocument = async (documentId) => {
    if (window.confirm("Are you sure you want to cancel this document?")) {
      try {
        const response = await fetch(`https://saleco.ruu-d.com/sale-co-requests/${documentId}/recall`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ status: "Available", note: "Cancelled" })
        });
        if (!response.ok) throw new Error("Failed to cancel the document");
        alert("Document cancelled successfully.");
        fetchHistory();
      } catch (error) {
        console.error("Error cancelling document:", error);
        alert("Failed to cancel document. Please try again.");
      }
    }
  };

  const SuccessMessage = () => (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999, width: "300px" }}>
      <div id="successToast" className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header bg-success text-white">
          <strong className="me-auto">Success</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setShowSuccessMessage(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">สร้างเอกสารสำเร็จ</div>
      </div>
    </div>
  );

  // Combine token check and initial data fetching into one useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!token || (tokenExpiry && new Date() > new Date(tokenExpiry))) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("tokenExpiry");
      window.location.href = "/";
    } else {
      fetchUserDetails();
      fetchProducts(1);
    }
  }, [fetchUserDetails, fetchProducts]);

  useEffect(() => {
    if (activeSection === "history" || activeSection === "canceled") fetchHistory();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "failed") {
      fetchFailedDocuments();
      setFailedPage(1);
    }
  }, [activeSection]);

  // Memoized filtered data
  const filteredHistory = useMemo(
    () =>
      transactionHistory.filter(
        (t) =>
          t.note !== "Cancelled" &&
          (debouncedHistorySearch === "" ||
            t.document_id.toString().toLowerCase().includes(debouncedHistorySearch.toLowerCase()) ||
            (t.name && t.name.toLowerCase().includes(debouncedHistorySearch.toLowerCase())) ||
            (t.customer_name && t.customer_name.toLowerCase().includes(debouncedHistorySearch.toLowerCase())) ||
            (t.sn_number && t.sn_number.toLowerCase().includes(debouncedHistorySearch.toLowerCase()))
          )
      ),
    [transactionHistory, debouncedHistorySearch]
  );

  const filteredCancelled = useMemo(
    () =>
      transactionHistory.filter(
        (t) =>
          t.note === "Cancelled" &&
          (debouncedCancelledSearch === "" ||
            t.document_id.toString().toLowerCase().includes(debouncedCancelledSearch.toLowerCase()) ||
            (t.name && t.name.toLowerCase().includes(debouncedCancelledSearch.toLowerCase())) ||
            (t.customer_name && t.customer_name.toLowerCase().includes(debouncedCancelledSearch.toLowerCase())) ||
            (t.sn_number && t.sn_number.toLowerCase().includes(debouncedCancelledSearch.toLowerCase()))
          )
      ),
    [transactionHistory, debouncedCancelledSearch]
  );

  const filteredFailedDocuments = useMemo(
    () =>
      failedDocuments.filter(
        (doc) =>
          debouncedFailedSearch === "" ||
          (doc.document_id && doc.document_id.toLowerCase().includes(debouncedFailedSearch.toLowerCase())) ||
          (doc.customer_name && doc.customer_name.toLowerCase().includes(debouncedFailedSearch.toLowerCase())) ||
          (doc.name && doc.name.toLowerCase().includes(debouncedFailedSearch.toLowerCase()))
      ),
    [failedDocuments, debouncedFailedSearch]
  );

  const groupAndSliceFailed = useCallback(
    (data, currentPage) =>
      Object.entries(
        data.slice((currentPage - 1) * pageSize, currentPage * pageSize).reduce((groups, { document_id, ...rest }) => {
          groups[document_id] = groups[document_id] || [];
          groups[document_id].push(rest);
          return groups;
        }, {})
      ),
    []
  );

  // Render a document group (for History, Canceled, and Failed sections)
  // Added extra parameter: showStoreNCButton, to optionally show the "Send to Store NC" action button.
  const renderDocGroup = (documentId, transactions, { bgColor, borderColor, titleClass, showCancel, showStoreNCButton }) => {
    const { name, customer_name, product_id, timestamp } = transactions[0];
    const formattedDate = new Date(timestamp).toLocaleDateString("en-GB");
    const serialNumbers = transactions.map((t) => t.sn_number).slice(0, 3).join(", ");
    const isExpanded = expandedCards[documentId];
    const isHovered = hoveredCard === documentId;

    // Split name if contains " แผนก "
    const delimiter = " แผนก ";
    let displayName = name;
    let displayDepartment = "";
    if (name && name.includes(delimiter)) {
      [displayName, displayDepartment] = name.split(delimiter);
    }

    return (
      <Card
        key={documentId}
        className="mb-3"
        style={{
          ...styles.card,
          ...(isHovered ? styles.cardHover : {}),
          borderLeft: `4px solid ${borderColor}`
        }}
        onMouseEnter={() => setHoveredCard(documentId)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Card.Header className={titleClass} style={styles.cardHeader}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaFileAlt style={{ marginRight: "0.5rem" }} />
            Document ID: {documentId}
          </span>
          <Badge bg={showCancel ? "success" : "danger"} style={styles.badge}>
            {showCancel ? "Active" : "Cancelled"}
          </Badge>
        </Card.Header>
        <Card.Body style={{ backgroundColor: bgColor, padding: "1.25rem" }}>
          <Row>
            <Col md={6}>
              <div style={styles.dataRow}>
                <div style={styles.dataLabel}>
                  <FaUser style={styles.dataIcon} /> Sale Coordinator
                </div>
                <div style={styles.dataValue}>{displayName}</div>
              </div>
              {displayDepartment && (
                <div style={styles.dataRow}>
                  <div style={styles.dataLabel}>
                    <FaBuilding style={styles.dataIcon} /> Department
                  </div>
                  <div style={styles.dataValue}>{displayDepartment}</div>
                </div>
              )}
              <div style={styles.dataRow}>
                <div style={styles.dataLabel}>
                  <FaUser style={styles.dataIcon} /> Customer
                </div>
                <div style={styles.dataValue}>{customer_name}</div>
              </div>
            </Col>
            <Col md={6}>
              <div style={styles.dataRow}>
                <div style={styles.dataLabel}>
                  <FaFileAlt style={styles.dataIcon} /> Product Code
                </div>
                <div style={styles.dataValue}>{product_id}</div>
              </div>
              <div style={styles.dataRow}>
                <div style={styles.dataLabel}>
                  <FaCalendarAlt style={styles.dataIcon} /> Created Date
                </div>
                <div style={styles.dataValue}>{formattedDate}</div>
              </div>
              <div style={styles.dataRow}>
                <div style={styles.dataLabel}>
                  <FaInfoCircle style={styles.dataIcon} /> Serial Numbers
                </div>
                <div style={styles.dataValue} className="small">
                  {serialNumbers}
                  {transactions.length > 3 && "…"}
                </div>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="link"
              onClick={() =>
                setExpandedCards((prev) => ({
                  ...prev,
                  [documentId]: !prev[documentId]
                }))
              }
              style={{ color: "#3498db", textDecoration: "none" }}
            >
              {isExpanded ? "See Less" : "See More"}
            </Button>
            {showCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleCancelDocument(documentId)}
                style={{
                  backgroundColor: "#e74c3c",
                  borderColor: "#e74c3c",
                  borderRadius: "4px"
                }}
              >
                <FaTimesCircle className="me-1" /> Cancel
              </Button>
            )}
          </div>
          {isExpanded && (
            <div className="mt-4">
              <Card style={{ ...styles.card, marginBottom: 0 }}>
                <Card.Header style={{ ...styles.cardHeader, backgroundColor: "#f8f9fa" }}>
                  <span style={{ fontWeight: "600" }}>Document Details</span>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                  <Table striped hover size="sm" className="mb-0" style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        <th>Serial Number</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                        {showStoreNCButton && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => {
                        const { id, sn_number, description, status, timestamp, QcmRemark } = transaction;
                        return (
                          <tr key={id}>
                            <td>{sn_number}</td>
                            <td>{description}</td>
                            <td>
                              <Badge bg={status === "Available" ? "success" : "secondary"} style={styles.badge}>
                                {status}
                              </Badge>
                            </td>
                            <td>
                              {new Date(timestamp).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })}
                            </td>
                            {showStoreNCButton && (
                              <td>
                                <Button variant="info" size="sm" onClick={() => handleOpenStoreNCModal(transaction)}>
                                  Send to Store NC
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderFailedSection = () => (
    <Card style={{ ...styles.card, marginTop: "1.5rem" }}>
      <Card.Header style={styles.cardHeader}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaTimesCircle style={styles.cardHeaderIcon} />
          Failed QC Documents
        </span>
      </Card.Header>
      <Card.Body>
        <SearchInput
          placeholder="Search by Document ID, Customer, or Coordinator..."
          value={failedSearchTerm}
          onChange={(e) => setFailedSearchTerm(e.target.value)}
        />
        {filteredFailedDocuments.length === 0 ? (
          <Alert variant="info" style={{ borderRadius: "0.5rem" }}>
            <div className="d-flex align-items-center">
              <FaInfoCircle className="me-2" />
              No failed QC documents found.
            </div>
          </Alert>
        ) : (
          groupAndSliceFailed(filteredFailedDocuments, failedPage).map(([documentId, transactions]) =>
            renderDocGroup(documentId, transactions, {
              bgColor: "#fff8f8",
              borderColor: "#e74c3c",
              titleClass: "text-danger",
              showCancel: false,
              showStoreNCButton: true
            })
          )
        )}
        <div style={styles.paginationContainer}>
          <Button
            variant="outline-primary"
            disabled={failedPage === 1}
            onClick={() => setFailedPage(failedPage - 1)}
            style={styles.paginationButton}
          >
            <FaArrowLeft className="me-1" /> Previous
          </Button>
          <span>
            Page {failedPage} of {Math.max(1, Math.ceil(filteredFailedDocuments.length / pageSize))}
          </span>
          <Button
            variant="outline-primary"
            disabled={failedPage >= Math.ceil(filteredFailedDocuments.length / pageSize)}
            onClick={() => setFailedPage(failedPage + 1)}
            style={styles.paginationButton}
          >
            Next <FaArrowRight className="ms-1" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div style={styles.pageContainer}>
      <Container className="py-4">
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={styles.headerTitle}>Sale Co-Ordinator</h2>
        </div>
        <Row>
          <Col md={3}>
            <div style={styles.sidebar}>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="d-flex justify-content-center align-items-center bg-primary rounded-circle p-2 me-2"
                  style={{ width: 40, height: 40 }}
                >
                  <FaUser color="white" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#2c3e50" }}>{userName || "User"}</div>
                  <div style={{ fontSize: "0.85rem", color: "#7f8c8d" }}>{department || "Department"}</div>
                </div>
              </div>
              <div style={styles.infoBox} className="mb-4">
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Navigation</div>
                <div style={{ fontSize: "0.85rem" }}>
                  Use the menu below to navigate between different sections of the system.
                </div>
              </div>
              <ListGroup>
                <ListGroup.Item
                  className="mb-2"
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                  }}
                  onClick={() => navigate("/edit-failed-qc")}
                >
                  <FaEdit className="me-2" /> Edit Failed QC
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "requests"}
                  onClick={() => setActiveSection("requests")}
                  style={{
                    ...styles.navItem,
                    ...(activeSection === "requests" ? styles.navItemActive : {})
                  }}
                >
                  <FaShoppingBasket className="me-2" /> สร้างเอกสาร
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "history"}
                  onClick={() => setActiveSection("history")}
                  style={{
                    ...styles.navItem,
                    ...(activeSection === "history" ? styles.navItemActive : {})
                  }}
                >
                  <FaHistory className="me-2" /> ประวัติเอกสาร
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "canceled"}
                  onClick={() => setActiveSection("canceled")}
                  style={{
                    ...styles.navItem,
                    ...(activeSection === "canceled" ? styles.navItemActive : {})
                  }}
                >
                  <FaTimesCircle className="me-2" /> เอกสารที่ยกเลิก
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeSection === "failed"}
                  onClick={() => setActiveSection("failed")}
                  style={{ ...styles.navItem, ...(activeSection === "failed" ? styles.navItemActive : {}) }}
                >
                  <FaTimesCircle className="me-2" /> Failed QC
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
          <Col md={9}>
            {activeSection === "requests" && (
              <>
                <Card style={styles.card}>
                  <Card.Header style={styles.cardHeader}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FaShoppingBasket style={styles.cardHeaderIcon} />
                      Basket
                    </span>
                    <Badge bg="primary" style={styles.badge}>
                      {basket.length} items
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    {basket.length === 0 ? (
                      <Alert variant="info" style={{ borderRadius: "0.5rem" }}>
                        <div className="d-flex align-items-center">
                          <FaInfoCircle className="me-2" />
                          Your basket is empty.
                        </div>
                      </Alert>
                    ) : (
                      <div style={styles.table}>
                        <Table striped bordered hover responsive>
                          <thead style={styles.tableHeader}>
                            <tr>
                              <th>Product Code</th>
                              <th>Serial</th>
                              <th>Description</th>
                              <th>Quantity</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {basket.map((item, idx) => {
                              const transaction = item.transactions?.[0] || {};
                              return (
                                <tr key={idx}>
                                  <td>{transaction["รหัสสินค้า"] || "Unknown"}</td>
                                  <td>{item.serial || "N/A"}</td>
                                  <td>{item.description || "No Description"}</td>
                                  <td>{item.quantity || 1}</td>
                                  <td>
                                    <Button
                                      variant="danger"
                                      onClick={() => handleRemoveFromBasket(item.serial)}
                                      size="sm"
                                      style={styles.dangerButton}
                                    >
                                      <FaTrashAlt className="me-1" /> Remove
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    )}
                    <div className="mt-3">
                      <Button
                        variant="primary"
                        onClick={() => setShowRequestModal(true)}
                        disabled={basket.length === 0}
                        style={basket.length > 0 ? styles.primaryButton : undefined}
                      >
                        <FaFileAlt className="me-2" /> Submit Request
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered backdrop="static" size="lg">
                  <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                    <Modal.Title style={{ color: "#2c3e50", fontWeight: "600" }}>
                      <FaFileAlt className="me-2" style={{ color: "#3498db" }} />
                      Submit Request
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ padding: "1.5rem" }}>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="customerName" style={{ fontWeight: "500" }}>
                              <FaUser className="me-1" style={{ color: "#3498db" }} /> ชื่อลูกค้า
                            </Form.Label>
                            <Form.Control
                              id="customerName"
                              type="text"
                              placeholder="Enter customer name"
                              value={formData.customerName}
                              onChange={(e) =>
                                setFormData({ ...formData, customerName: e.target.value })
                              }
                              style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="wantDate" style={{ fontWeight: "500" }}>
                              <FaCalendarAlt className="me-1" style={{ color: "#3498db" }} /> วันที่ต้องการสินค้า
                            </Form.Label>
                            <Form.Control
                              id="wantDate"
                              type="date"
                              value={formData.wantDate}
                              onChange={(e) =>
                                setFormData({ ...formData, wantDate: e.target.value })
                              }
                              style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="customerAddress" style={{ fontWeight: "500" }}>
                          <FaMapMarkerAlt className="me-1" style={{ color: "#3498db" }} /> ที่อยู่ลูกค้า
                        </Form.Label>
                        <Form.Control
                          id="customerAddress"
                          type="text"
                          placeholder="Enter customer address"
                          value={formData.customerAddress}
                          onChange={(e) =>
                            setFormData({ ...formData, customerAddress: e.target.value })
                          }
                          style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem" }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: "500" }}>
                          <FaInfoCircle className="me-1" style={{ color: "#3498db" }} /> รายละเอียดการแจ้งงาน
                        </Form.Label>
                        <Select
                          isMulti
                          options={requestDetailsOptions}
                          styles={selectStyles}
                          value={requestDetailsOptions.filter((opt) =>
                            formData.requestDetails.includes(opt.value)
                          )}
                          onChange={(sel) =>
                            setFormData({
                              ...formData,
                              requestDetails: sel ? sel.map((opt) => opt.value) : []
                            })
                          }
                          placeholder="เลือกรายละเอียด..."
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="remarks" style={{ fontWeight: "500" }}>
                          <FaInfoCircle className="me-1" style={{ color: "#3498db" }} /> Remarks
                        </Form.Label>
                        <Form.Control
                          id="remarks"
                          as="textarea"
                          rows={3}
                          placeholder="Enter remarks"
                          value={formData.remark}
                          onChange={(e) =>
                            setFormData({ ...formData, remark: e.target.value })
                          }
                          style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem" }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: "500" }}>
                          <FaBuilding className="me-1" style={{ color: "#3498db" }} /> เก็บค่าใช้จ่ายแผนก
                        </Form.Label>
                        <Select
                          options={departmentOptions}
                          styles={selectStyles}
                          placeholder="Select department expense"
                          value={
                            departmentOptions.find(
                              (opt) => opt.value === formData.departmentExpense
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            setFormData({
                              ...formData,
                              departmentExpense: selectedOption ? selectedOption.value : ""
                            })
                          }
                          isClearable
                          isSearchable
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer style={{ border: "none", padding: "0.75rem 1.5rem 1.5rem" }}>
                    <Button variant="secondary" onClick={() => setShowRequestModal(false)} style={styles.secondaryButton}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleRequestSubmission}
                      disabled={isSubmitting}
                      style={isSubmitting ? undefined : styles.primaryButton}
                    >
                      {isSubmitting ? (
                        <div className="d-flex align-items-center">
                          <LoadingSpinner size="24px" />
                          <span className="ms-2">Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <FaFileAlt className="me-2" /> Submit Request
                        </>
                      )}
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Card style={{ ...styles.card, marginTop: "1.5rem" }}>
                  <Card.Header style={styles.cardHeader}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FaSearch style={styles.cardHeaderIcon} />
                      Search Products
                    </span>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <div className="d-flex gap-2 mb-3">
                          <Form.Control
                            placeholder="Product Code"
                            value={searchParams.itemCode}
                            onChange={(e) =>
                              setSearchParams({ ...searchParams, itemCode: e.target.value })
                            }
                            style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem", flex: 1 }}
                          />
                          <Form.Control
                            placeholder="Serial Number"
                            value={searchParams.serial}
                            onChange={(e) =>
                              setSearchParams({ ...searchParams, serial: e.target.value })
                            }
                            style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem", flex: 1 }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="d-flex gap-2">
                          <Button variant="primary" onClick={handleSearch} style={{ ...styles.primaryButton, flex: 1 }}>
                            <FaSearch className="me-1" /> Search
                          </Button>
                          <Button variant="secondary" onClick={handleReset} style={{ ...styles.secondaryButton, flex: 1 }}>
                            Reset
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                <Card style={{ ...styles.card, marginTop: "1.5rem" }}>
                  <Card.Header style={styles.cardHeader}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FaFileAlt style={styles.cardHeaderIcon} />
                      Products
                    </span>
                    <Badge bg="primary" style={styles.badge}>
                      {totalItems} products found
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    {loadingProducts ? (
                      <LoadingSpinner />
                    ) : products.length === 0 ? (
                      <Alert variant="warning" style={{ borderRadius: "0.5rem" }}>
                        <div className="d-flex align-items-center">
                          <FaInfoCircle className="me-2" />
                          No products found.
                        </div>
                      </Alert>
                    ) : (
                      <>
                        <div style={styles.table}>
                          <Table striped bordered hover responsive>
                            <thead style={styles.tableHeader}>
                              <tr>
                                <th>รหัสสินค้า</th>
                                <th>Date</th>
                                <th>Serial No</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.map((product, idx) => {
                                const transaction = product.transactions?.[0] || {};
                                return (
                                  <tr key={idx}>
                                    <td>{transaction["รหัสสินค้า"] || product.itemCode || "Unknown"}</td>
                                    <td>
                                      {new Date(transaction["วันที่"] || product.lastReceiptDate).toLocaleDateString(
                                        "en-GB"
                                      )}
                                    </td>
                                    <td>{product.serial || "N/A"}</td>
                                    <td>{transaction["ชื่อสินค้า"] || "No Description"}</td>
                                    <td>
                                      <Badge
                                        bg={product.status === "Available" ? "success" : "secondary"}
                                        style={styles.badge}
                                      >
                                        {product.status || "Unknown"}
                                      </Badge>
                                    </td>
                                    <td>1</td>
                                    <td>
                                      <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedProduct(product);
                                          setShowQuantityModal(true);
                                        }}
                                        disabled={product.status !== "Available"}
                                        style={product.status === "Available" ? styles.successButton : undefined}
                                      >
                                        <FaPlus className="me-1" /> Select
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                        <div style={styles.paginationContainer}>
                          <Button
                            variant="outline-primary"
                            disabled={page === 1 || loadingProducts}
                            onClick={() => handlePageChange(page - 1)}
                            style={styles.paginationButton}
                          >
                            <FaArrowLeft className="me-1" /> Previous
                          </Button>
                          <span>
                            Page {page} of {Math.max(1, Math.ceil(totalItems / pageSize))}
                          </span>
                          <Button
                            variant="outline-primary"
                            disabled={page >= Math.ceil(totalItems / pageSize) || loadingProducts}
                            onClick={() => handlePageChange(page + 1)}
                            style={styles.paginationButton}
                          >
                            Next <FaArrowRight className="ms-1" />
                          </Button>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
                <Modal show={showQuantityModal} onHide={() => setShowQuantityModal(false)} centered>
                  <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                    <Modal.Title style={{ color: "#2c3e50", fontWeight: "600" }}>
                      <FaPlus className="me-2" style={{ color: "#3498db" }} />
                      Select Quantity
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ padding: "1.5rem" }}>
                    {selectedProduct && selectedProduct.transactions?.[0] ? (
                      <>
                        <div style={styles.summaryCard}>
                          <div style={styles.dataRow}>
                            <div style={styles.dataLabel}>
                              <FaFileAlt style={styles.dataIcon} /> Product Code
                            </div>
                            <div style={styles.dataValue}>
                              {selectedProduct.transactions[0]["รหัสสินค้า"]}
                            </div>
                          </div>
                        </div>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="product-quantity" style={{ fontWeight: "500" }}>
                            <FaInfoCircle className="me-1" style={{ color: "#3498db" }} /> Quantity
                          </Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            defaultValue="1"
                            id="product-quantity"
                            style={{ borderRadius: "0.375rem", padding: "0.6rem 1rem" }}
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <Alert variant="danger" style={{ borderRadius: "0.5rem" }}>
                        <div className="d-flex align-items-center">
                          <FaInfoCircle className="me-2" />
                          Product data is invalid or missing.
                        </div>
                      </Alert>
                    )}
                  </Modal.Body>
                  <Modal.Footer style={{ border: "none", padding: "0.75rem 1.5rem 1.5rem" }}>
                    <Button variant="secondary" onClick={() => setShowQuantityModal(false)} style={styles.secondaryButton}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddToBasket} style={styles.primaryButton}>
                      <FaShoppingBasket className="me-1" /> Add to Basket
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
            {activeSection === "history" && (
              <>
                <Card className="mb-4" style={styles.card}>
                  <Card.Header style={styles.cardHeader}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FaSearch style={styles.cardHeaderIcon} />
                      Search History
                    </span>
                  </Card.Header>
                  <Card.Body>
                    <SearchInput
                      placeholder="Search by Document ID, Customer, or Coordinator..."
                      value={historySearchTerm}
                      onChange={(e) => setHistorySearchTerm(e.target.value)}
                    />
                    <div style={styles.infoBox}>
                      <div className="d-flex align-items-center">
                        <FaInfoCircle className="me-2" />
                        <span>
                          Search for documents by entering document ID, customer name, or sale coordinator name.
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                {loadingHistory ? (
                  <LoadingSpinner />
                ) : filteredHistory.length === 0 ? (
                  <Alert variant="info" style={{ borderRadius: "0.5rem" }}>
                    <div className="d-flex align-items-center">
                      <FaInfoCircle className="me-2" />
                      No transaction history found.
                    </div>
                  </Alert>
                ) : (
                  <>
                    {groupAndSlice(filteredHistory).map(([documentId, transactions]) =>
                      renderDocGroup(documentId, transactions, {
                        bgColor: "#f8fffa",
                        borderColor: "#2ecc71",
                        titleClass: "text-success",
                        showCancel: true
                      })
                    )}
                    <div style={styles.paginationContainer}>
                      <Button
                        variant="outline-primary"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        style={styles.paginationButton}
                      >
                        <FaArrowLeft className="me-1" /> Previous
                      </Button>
                      <span>
                        Page {page} of {Math.max(1, Math.ceil(filteredHistory.length / pageSize))}
                      </span>
                      <Button
                        variant="outline-primary"
                        disabled={page >= Math.ceil(filteredHistory.length / pageSize)}
                        onClick={() => setPage(page + 1)}
                        style={styles.paginationButton}
                      >
                        Next <FaArrowRight className="ms-1" />
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
            {activeSection === "canceled" && (
              <>
                <Card className="mb-4" style={styles.card}>
                  <Card.Header style={styles.cardHeader}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <FaSearch style={styles.cardHeaderIcon} />
                      Search Canceled Documents
                    </span>
                  </Card.Header>
                  <Card.Body>
                    <SearchInput
                      placeholder="Search by Document ID, Customer, or Coordinator..."
                      value={cancelledSearchTerm}
                      onChange={(e) => setCancelledSearchTerm(e.target.value)}
                    />
                    <div style={styles.infoBox}>
                      <div className="d-flex align-items-center">
                        <FaInfoCircle className="me-2" />
                        <span>
                          Search for canceled documents by entering document ID, customer name, or sale coordinator name.
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                {loadingHistory ? (
                  <LoadingSpinner />
                ) : filteredCancelled.length === 0 ? (
                  <Alert variant="info" style={{ borderRadius: "0.5rem" }}>
                    <div className="d-flex align-items-center">
                      <FaInfoCircle className="me-2" />
                      No canceled transactions found.
                    </div>
                  </Alert>
                ) : (
                  <>
                    {groupAndSlice(filteredCancelled).map(([documentId, transactions]) =>
                      renderDocGroup(documentId, transactions, {
                        bgColor: "#fff8f8",
                        borderColor: "#e74c3c",
                        titleClass: "text-danger",
                        showCancel: false
                      })
                    )}
                    <div style={styles.paginationContainer}>
                      <Button
                        variant="outline-primary"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        style={styles.paginationButton}
                      >
                        <FaArrowLeft className="me-1" /> Previous
                      </Button>
                      <span>
                        Page {page} of {Math.ceil(filteredCancelled.length / pageSize)}
                      </span>
                      <Button
                        variant="outline-primary"
                        disabled={page >= Math.ceil(filteredCancelled.length / pageSize)}
                        onClick={() => setPage(page + 1)}
                        style={styles.paginationButton}
                      >
                        Next <FaArrowRight className="ms-1" />
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
            {activeSection === "failed" && renderFailedSection()}
          </Col>
        </Row>
      </Container>
      {showSuccessMessage && <SuccessMessage />}
      {/* Store NC Modal for additional NC data inputs */}
      {storeNCModalVisible && selectedStoreNCData && (
        <Modal show={storeNCModalVisible} onHide={() => setStoreNCModalVisible(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa", border: "none" }}>
            <Modal.Title style={{ color: "#2c3e50", fontWeight: "600" }}>
              Store NC Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "1.5rem" }}>
            <p>
              <strong>Product ID:</strong> {selectedStoreNCData.product_id || "-"}
            </p>
            <p>
              <strong>Serial Number:</strong> {selectedStoreNCData.sn_number}
            </p>
            <p>
              <strong>Description:</strong> {selectedStoreNCData.description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge bg={selectedStoreNCData.status === "Available" ? "success" : "secondary"} style={styles.badge}>
                {selectedStoreNCData.status}
              </Badge>
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(selectedStoreNCData.timestamp).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
            </p>
            <p>
              <strong>QCM Remark:</strong> {selectedStoreNCData.QcmRemark || "-"}
            </p>
            <hr />
            {/* New NC Form Fields */}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product type"
                  value={ncFormData.productType}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, productType: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lot. No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Lot Number"
                  value={ncFormData.lotNo}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, lotNo: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pack Size</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Pack Size"
                  value={ncFormData.packSize}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, packSize: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Found Issue</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Describe the issue found"
                  value={ncFormData.foundIssue}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, foundIssue: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Defect Reporter</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter reporter's name/signature"
                  value={ncFormData.defectReporter}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, defectReporter: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Inventory Source</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter inventory source"
                  value={ncFormData.inventorySource}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, inventorySource: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Issue Details</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter issue details"
                  value={ncFormData.issueDetails}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, issueDetails: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Preventive Actions</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter preventive actions"
                  value={ncFormData.preventiveActions}
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, preventiveActions: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>NC Image 1</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, ncImage1: e.target.files[0] })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>NC Image 2</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setNcFormData({ ...ncFormData, ncImage2: e.target.files[0] })
                  }
                />
              </Form.Group>
            </Form>
            <Alert variant="info">
              Clicking <strong>Submit to NC</strong> will copy all record data (excluding certain columns)
              for this serial from SaleCoRequests into the NC table along with the NC information entered below.
              The status for this serial will be updated to <strong>At Store NC</strong>.
            </Alert>
          </Modal.Body>
          <Modal.Footer style={{ border: "none", padding: "0.75rem 1.5rem 1.5rem" }}>
            <Button variant="secondary" onClick={() => setStoreNCModalVisible(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleStoreNCSubmit}>
              Submit to NC
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SaleCoRequests;
