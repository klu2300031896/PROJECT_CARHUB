import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../services/api";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

function Admin() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [stats, setStats] = useState({});
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      window.location.href = "/cars";
    }

    API.get("/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setStats(res.data)).catch(console.error);

    API.get(`/cars?page=${page}&size=8`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setCars(res.data.content);
      setTotalPages(res.data.totalPages || 1);
    }).catch(console.error);

    API.get("/admin/pending-admins", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setPendingAdmins(res.data)).catch(console.error);
  }, [token, page]);

  const saveCar = async () => {
    if (!brand || !model || !fuelType || !price) {
      Swal.fire({ icon: "error", title: "Error", text: "Fill all fields", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      return;
    }

    let uploadedImage = "";
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const upload = await API.post("/upload/car", formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
        });
        uploadedImage = upload.data;
      }

      if (editId) {
        await API.put(`/admin/cars/${editId}`, {
          brand,
          model,
          fuelType,
          pricePerDay: Number(price),
          available: true,
          imageUrl: uploadedImage
        }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: "success", title: "Success", text: "Car updated", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      } else {
        await API.post("/admin/cars", {
          brand,
          model,
          fuelType,
          pricePerDay: Number(price),
          available: true,
          imageUrl: uploadedImage
        }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: "success", title: "Success", text: "Car added", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Operation failed", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail) {
      Swal.fire({ icon: "error", title: "Error", text: "Enter admin email", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      return;
    }
    try {
      await API.post(`/admin/request-admin?email=${encodeURIComponent(newAdminEmail)}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: "success", title: "Success", text: "Approval email sent", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Approval request failed", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    }
  };

  const approveAdmin = async (id) => {
    try {
      await API.post(`/admin/approve-admin?id=${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: "success", title: "Success", text: "Admin approved", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      window.location.reload();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Approve failed", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    }
  };

  const rejectAdmin = async (id) => {
    try {
      await API.post(`/admin/reject-admin?id=${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: "success", title: "Success", text: "Request rejected", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      window.location.reload();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Reject failed", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    }
  };

  const deleteCar = async (id) => {
    try {
      await API.delete(`/admin/cars/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ icon: "success", title: "Success", text: "Car deleted", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      window.location.reload();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Cannot delete car with bookings", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await API.put(`/admin/cars/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ icon: "success", title: "Success", text: "Availability updated", confirmButtonColor: "#d4af37", timer: 4800, showConfirmButton: false });
      window.location.reload();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Update failed", confirmButtonColor: "#d4af37" });
    }
  };

  const bookCar = async (carId) => {
    try {
      await API.post(
        `/user/book/${carId}?startDate=2026-03-20&endDate=2026-03-22`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({ icon: "success", title: "Success", text: "Booking successful", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
      window.location.reload();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Booking failed", confirmButtonColor: "#d4af37", timer: 2200, showConfirmButton: false });
    }
  };

  const editCar = (car) => {
    setEditId(car.id);
    setBrand(car.brand);
    setModel(car.model);
    setFuelType(car.fuelType);
    setPrice(car.pricePerDay);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />
      <div className="container">
        {name && <h1 className="page-heading" style={{ marginBottom: 12 }}>{`Welcome, "${name}"`}</h1>}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <img src={logo} alt="CARHUB" style={{ width: 40, height: 40, borderRadius: 8 }} onError={(e) => e.target.style.display = "none"} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>CARHUB</div>
            <div style={{ color: "#cbd5e1", fontSize: 12 }}>Admin Console</div>
          </div>
        </div>
        <h1 className="page-heading">Admin Dashboard</h1>
        <div className="grid grid-3" style={{ marginBottom: 20 }}>
          <div className="section"><p style={{ margin: 0, color: "#cbd5e1" }}>Cars</p><h2>{stats.totalCars || 0}</h2></div>
          <div className="section"><p style={{ margin: 0, color: "#cbd5e1" }}>Users</p><h2>{stats.totalUsers || 0}</h2></div>
          <div className="section"><p style={{ margin: 0, color: "#cbd5e1" }}>Bookings</p><h2>{stats.totalBookings || 0}</h2></div>
        </div>

        <div className="grid grid-2" style={{ gap: 12, marginBottom: 20 }}>
          <div className="section">
            <h2 style={{ marginTop: 0 }}>Add / Edit Car</h2>
            <input className="field" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <input className="field" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
            <input className="field" type="number" placeholder="Price per Day" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input className="field" placeholder="Fuel Type" value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
            <input className="field" type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            <button className="btn btn-gold" style={{ marginTop: 8 }} onClick={saveCar}>{editId ? "Update Car" : "Add Car"}</button>
          </div>
          <div className="section">
            <h2 style={{ marginTop: 0 }}>Add New Admin</h2>
            <input className="field" placeholder="Enter Email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
            <button className="btn btn-gold" style={{ marginTop: 8 }} onClick={addAdmin}>Send Approval Email</button>
          </div>
        </div>

        <div className="section" style={{ marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>Pending Admin Requests</h2>
          {pendingAdmins.length === 0 ? (
            <p style={{ color: "#cbd5e1" }}>No pending requests</p>
          ) : (
            pendingAdmins.map((req) => (
              <div key={req.id} style={{ border: "1px solid #f5d76e", backgroundColor: "#111827", padding: 10, marginBottom: 10, borderRadius: 6 }}>
                <p style={{ margin: 0, color: "#f8fafc" }}>{req.email}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="btn btn-gold" onClick={() => approveAdmin(req.id)}>Approve</button>
                  <button className="btn btn-danger" onClick={() => rejectAdmin(req.id)}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>

        <section className="section">
          <h2 style={{ marginTop: 0 }}>All Cars</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {cars.map((car) => (
              <div className="card" key={car.id} style={{ padding: 12 }}>
                <div style={{ height: 150, overflow: "hidden", borderRadius: 8, marginBottom: 10 }}>
                  <img src={car.imageUrl ? `http://localhost:8080${car.imageUrl}` : "https://via.placeholder.com/250x150?text=No+Image"} alt="car" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ margin: "0 0 4px" }}>{car.brand} {car.model}</h3>
                <p style={{ margin: "2px 0", color: "#94a3b8" }}>ID: {car.id}</p>
                <p style={{ margin: "2px 0", color: "#cbd5e1" }}>Fuel: {car.fuelType}</p>
                <p style={{ margin: "2px 0", color: "#f5d76e" }}>Rs. {car.pricePerDay}/day</p>
                <p style={{ margin: "2px 0", color: car.available ? "#22c55e" : "#f87171" }}>{car.available ? "Available" : "Booked"}</p>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={() => editCar(car)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteCar(car.id)}>Delete</button>
                  <button className="btn btn-gold" onClick={() => toggleAvailability(car.id)}>Toggle</button>
                  <button className="btn btn-gold" onClick={() => bookCar(car.id)}>Book</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-secondary" onClick={() => setPage((prev) => prev - 1)} disabled={page === 0}>
              Prev
            </button>
            <span>Page {page + 1}</span>
            <button className="btn btn-secondary" onClick={() => setPage((prev) => prev + 1)} disabled={page + 1 >= totalPages}>
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
