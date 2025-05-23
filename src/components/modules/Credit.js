import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteWithConfirmation from "../DeleteWithConfirmation";

const backendUrl = "http://localhost:5000";
const adminId = localStorage.getItem("adminId");

const CreditManagement = () => {
  const [editPlan, setEditPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [creditPlans, setCreditPlans] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/credit-plans/`);
      setCreditPlans(response.data);
    } catch (err) {
      console.error("Error fetching credit plans:", err);
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="flex w-full flex-row">
        <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start hover:font-sans outlined-text">
          CREDIT
        </h1>
        <div className="flex flex-1 float-right justify-end">
          <button
            className="mr-5 rounded-xl px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all text-red-600 font-bold flex justify-center items-center float-right gap-2"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Create Credit
          </button>
        </div>
      </div>
      {showForm ? (
        <CreateCreditPlan
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setShowForm={setShowForm}
        />
      ) : isEditing ? (
        <ManageCreditPlans
          creditPlans={[editPlan]}
          fetchCredits={fetchCredits}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setIsEditing={setIsEditing}
        />
      ) : (
        <DisplayCredits
          creditPlans={creditPlans}
          fetchCredits={fetchCredits}
          onEdit={(plan) => {
            setEditPlan(plan);
            setIsEditing(true);
          }}
        />
      )}
    </div>

    // <Container maxWidth="md">
    //   <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
    //     <Tab label="Create Credits" />
    //     <Tab label="Manage Credits" />
    //     <Tab label="Display Credits" />
    //   </Tabs>

    //   {tabIndex === 0 && <CreateCreditPlan setAlertMessage={setAlertMessage} setAlertOpen={setAlertOpen} />}
    //   {tabIndex === 1 && <ManageCreditPlans creditPlans={creditPlans} fetchCredits={fetchCredits} setAlertMessage={setAlertMessage} setAlertOpen={setAlertOpen} />}

    //   {tabIndex === 2 && <DisplayCredits creditPlans={creditPlans} />}

    //   <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
    //     <Alert onClose={() => setAlertOpen(false)} severity="success">{alertMessage}</Alert>
    //   </Snackbar>
    // </Container>
  );
};

const CreateCreditPlan = ({ setAlertMessage, setAlertOpen, setShowForm }) => {
  const [creditAmount, setCreditAmount] = useState("");
  const [credit, setCredit] = useState("");
  const [questionLimit, setQuestionLimit] = useState("");
  const [description, setDescription] = useState("");
  const [validUpto, setValidUpto] = useState("");
  const [offer, setOffer] = useState("");
  const [extraCredit, setExtraCredit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionPerCredit, setQuestionPerCredit] = useState("");
  const [voicePerMinute, setVoicePerMinute] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        creditAmount: parseFloat(creditAmount),
        credit: parseInt(credit, 10),
        questionPerCredit: parseInt(questionPerCredit, 10),
        voicePerMinute: parseInt(voicePerMinute, 10),
        description,
        validUpto,
        offer: offer.trim() !== "" ? parseFloat(offer) : undefined,
        extraCredit:
          extraCredit.trim() !== "" ? parseFloat(extraCredit) : undefined,
      };
      await axios.post(
        `${backendUrl}/api/credit-plans/add/${adminId}`,
        payload
      );
      setCreditAmount("");
      setCredit("");
      setDescription("");
      setValidUpto("");
      setOffer("");
      setExtraCredit("");
      setAlertMessage("Credit plan created successfully!");
      setQuestionPerCredit("");
      setVoicePerMinute("");
      setAlertOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3, p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5">Add Credit Plan</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Questions Per Credit"
        fullWidth
        value={questionPerCredit}
        onChange={(e) => setQuestionPerCredit(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Voice Per Minute Credit"
        fullWidth
        value={voicePerMinute}
        onChange={(e) => setVoicePerMinute(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Credit Amount"
        fullWidth
        value={creditAmount}
        onChange={(e) => setCreditAmount(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Credit"
        fullWidth
        value={credit}
        onChange={(e) => setCredit(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Valid Upto"
        fullWidth
        value={validUpto}
        onChange={(e) => setValidUpto(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Offer (%)"
        fullWidth
        value={offer}
        onChange={(e) => setOffer(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Extra Credit"
        fullWidth
        value={extraCredit}
        onChange={(e) => setExtraCredit(e.target.value)}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Add Plan"}
      </Button>
      <Button
        onClick={() => setShowForm(false)}
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

const DisplayCredits = ({
  creditPlans,
  fetchCredits,
  onEdit,
  setAlertMessage,
  setAlertOpen,
}) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/credit-plans/${id}`);
      fetchCredits();
      setAlertMessage("Credit plan deleted successfully!");
      setAlertOpen(true);
    } catch (err) {
      console.error("Error deleting credit plan:", err);
    }
  };

  return (
    <section className="w-full h-screen hide-scollbar mt-3 mr-5">
      {creditPlans.map((plan) => (
        <div
          className="md:h-52 h-80 w-full flex flex-col md:flex-row m-2 shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-7 px-4 py-6 items-center"
          key={plan._id}
        >
          <div className="txt w-full md:h-52 h-20 flex-col items-center justify-center px-4 py-4 mt-5">
            <table className="w-full">
              <tr>
                <td>
                  <h1 className="text-lg font-bold text-red-950 my-2">
                    Questions Per Credit
                  </h1>
                </td>
                <td>{plan.questionPerCredit}</td>
                <td>
                  <h1 className="text-lg my-2">Credits</h1>
                </td>
                <td>{plan.credit}</td>
              </tr>

              <tr>
                <td>
                  <h1 className="text-lg my-2">Voice Per Minute Credit</h1>
                </td>
                <td>{plan.voicePerMinute}</td>
                <td>
                  <h1 className="text-lg my-2">Valid Upto</h1>
                </td>
                <td>{plan.validUpto}</td>
              </tr>
              <tr>
                <td>
                  <h1 className="text-lg my-2">Credit Amount</h1>
                </td>
                <td>{plan.creditAmount}</td>
                <td>
                  {" "}
                  <h1 className="text-lg my-2">Offer</h1>
                </td>
                <td>{plan.offer}%</td>
              </tr>
              <tr>
              <td>
                <h1 className="text-lg my-2">Description</h1>
                </td>
                <td>
                  {" "}
                  <h1 className="text-lg my-2">{plan.description}</h1>
                </td>
                <td>
                  <h1 className="text-lg my-2">Extra Credit</h1>
                </td>
                <td>{plan.extraCredit}</td>
              </tr>
            </table>
            {/* <h1 className="text-xl font-bold text-red-950 my-2">
                Questions Per Credit: {plan.questionPerCredit}
                </h1>
                <h1 className="text-xl text-black my-2">
                Voice Per Minute Credit: {plan.voicePerMinute}
                </h1>

                <h1 className="text-lg text-red-700 font-bold my-2">
                Credit Amount: {plan.creditAmount}
                </h1>
                <h1 className="text-lg text-red-700 font-bold my-2">
                {plan.description}
                </h1>
                <h1 className="text-lg text-red-700 font-bold my-2">
                Credits: {plan.credit}
                </h1>
                <h1 className="text-lg text-red-700 font-bold my-2">
                Valid Upto: {plan.validUpto}                </h1>
                <h1 className="text-lg text-red-700 font-bold my-2">
                Offer: {plan.offer}%
                </h1>
                <h1 className="text-lg text-red-700 font-bold my-2">
                Extra Credit: {plan.extraCredit}                </h1> */}
          </div>

          <div className="w-full md:w-80 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
            <button
              className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
              onClick={() => onEdit(plan)}
            >
              EDIT
              <i class="fa-solid fa-pen-to-square px-2"></i>
            </button>
            <DeleteWithConfirmation
              handleDeleteitem={() => handleDelete(plan.id)}
            />
          </div>
        </div>
      ))}
    </section>

    // <Box sx={{ mt: 5 }}>
    //   <Box sx={{ mt: 3 }}>
    //   <Typography variant="h5" sx={{ mb: 2 }}>
    //     Available Credit Plans
    //   </Typography>
    //     <Box
    //       sx={{
    //         display: "grid",
    //         gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    //         gap: 2,
    //       }}
    //     >
    //       {creditPlans.map((plan) => (
    //         <Card key={plan.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
    //           <CardContent>
    //             <Typography variant="h6" fontWeight="bold">
    //               Questions Per Credit: {plan.questionPerCredit}
    //             </Typography>
    //             <Typography variant="h6" fontWeight="bold">
    //               Voice Per Minute Credit: {plan.voicePerMinute}
    //             </Typography>
    //             <Typography variant="h6" fontWeight="bold">
    //               Credit Amount: {plan.creditAmount}
    //             </Typography>
    //             <Typography variant="subtitle1" color="textSecondary">
    //               {plan.description}
    //             </Typography>
    //             <Typography>Credits: {plan.credit}</Typography>
    //             <Typography>Valid Upto: {plan.validUpto}</Typography>
    //             <Typography color="primary">Offer: {plan.offer}%</Typography>
    //             <Typography fontWeight="bold" color="secondary">
    //               Extra Credit: {plan.extraCredit}
    //             </Typography>

    //             <button
    //               className="rounded-xl mt-5 mr-4 px-1 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
    //               onClick={() => onEdit(plan)}
    //             >
    //               EDIT
    //               <i className="fa-solid fa-pen-to-square px-2"></i>
    //             </button>

    //             <DeleteWithConfirmation handleDeleteitem={() => handleDelete(plan.id)} />
    //           </CardContent>
    //         </Card>
    //       ))}
    //     </Box>
    //   </Box>
    // </Box>
  );
};

const ManageCreditPlans = ({
  creditPlans = [],
  fetchCredits,
  setAlertMessage,
  setAlertOpen,
  setIsEditing,
}) => {
  const [updatedPlans, setUpdatedPlans] = useState({});

  const handleChange = (id, field, value) => {
    setUpdatedPlans((prev) => {
      const updatedPlan = {
        ...prev[id],
        [field]: value,
      };

      return { ...prev, [id]: updatedPlan };
    });
  };

  const handleUpdate = async (id) => {
    if (!updatedPlans[id]) return;
    console.log(id);
    try {
      await axios.put(`${backendUrl}/api/credit-plans/${id}`, updatedPlans[id]);
      fetchCredits();
      // setAlertMessage("Credit plan updated successfully!");
      // setAlertOpen(true);
      alert("Credit plan updated successfully!")
      setIsEditing(false)
    } catch (err) {
      console.error("Error updating credit plan:", err);
    }
  };

  return (
    <div className="flex justify-center items-center w-full overflow-y-auto">
    <Box
      sx={{
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        width:"50%"
        
      }}
    >
      {creditPlans.map((plan) => (
        <Box
          key={plan._id}
          sx={{
            p: 3,
            boxShadow: 4,
            borderRadius: 3,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
            ✏️ Edit Plan: {plan.description}
          </Typography>
  
          <TextField
            label="Credit Amount"
            fullWidth
            defaultValue={plan.creditAmount}
            onChange={(e) => handleChange(plan._id, "creditAmount", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Credit"
            fullWidth
            defaultValue={plan.credit}
            onChange={(e) => handleChange(plan._id, "credit", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Questions Per Credit"
            fullWidth
            defaultValue={plan.questionPerCredit}
            onChange={(e) => handleChange(plan._id, "questionPerCredit", e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Voice Per Minute"
            fullWidth
            defaultValue={plan.voicePerMinute}
            onChange={(e) => handleChange(plan._id, "voicePerMinute", e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Description"
            fullWidth
            defaultValue={plan.description}
            onChange={(e) => handleChange(plan._id, "description", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Valid Upto"
            fullWidth
            defaultValue={plan.validUpto?.split("T")[0]}
            onChange={(e) => handleChange(plan._id, "validUpto", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Offer (%)"
            fullWidth
            defaultValue={plan.offer}
            onChange={(e) => handleChange(plan._id, "offer", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Extra Credit"
            fullWidth
            defaultValue={plan.extraCredit}
            onChange={(e) => handleChange(plan._id, "extraCredit", e.target.value)}
            sx={{ mb: 3 }}
          />
  
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#4CAF50",
                color: "#fff",
                "&:hover": { bgcolor: "#43a047" },
                flex: 1,
                fontWeight: "bold",
                borderRadius: "8px",
              }}
              onClick={() => handleUpdate(plan._id)}
            >
              💾 Update
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "#f44336",
                borderColor: "#f44336",
                "&:hover": {
                  bgcolor: "#fddede",
                  borderColor: "#f44336",
                },
                flex: 1,
                fontWeight: "bold",
                borderRadius: "8px",
              }}
              onClick={() => setIsEditing(false)}
            >
              ❌ Cancel
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  </div>
  
  );
};

export default CreditManagement;
