import { useState } from "react";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { getParams, updateParams, resetParams } from "../services/setting";

const Setting = () => {
  const [open, setOpen] = useState(false);
  const [temperature, setTemperature] = useState(getParams().temperature);
  const [topK, setTopK] = useState(getParams().topK);
  const [topP, setTopP] = useState(getParams().topP);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    updateParams({ temperature, topK });
    alert("Settings updated!");
  };

  const handleReset = () => {
    resetParams();
    setTemperature(getParams().temperature);
    setTopK(getParams().topK);
    setTopP(getParams().topP);
  };

  const style = {
    "& .MuiSlider-thumb": {
      "&:hover, &.Mui-focusVisible": {
        boxShadow: `none`,
      },
    },
    "& .MuiSlider-rail": {
      bgcolor: "rgb(var(--loader-bg-color))",
    },
    "& .MuiSlider-track": {
      width: 10,
    },
  };
  return (
    <div>
      <button onClick={handleOpen}>
        <SettingsRoundedIcon className="text-primary" fontSize="small" />
      </button>
      <Modal open={open} onClose={handleClose}>
        <div
          className="absolute w-[80vw] bg-secondary-bg border border-br p-2 rounded transition-all duration-700"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <label className="text-primary px-6">
            Temperature:
            <div className="flex items-center px-6 gap-4">
              <Slider
                defaultValue={1.0}
                step={0.05}
                min={0.05}
                max={2.0}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                sx={style}
              />
              <div className="w-16 h-10 p-2 border border-br rounded-md text-center">
                <p>{temperature}</p>
              </div>
            </div>
          </label>
          <label className="text-primary">
            Top-P:
            <div className="flex items-center px-6 gap-4">
              <Slider
                defaultValue={1}
                step={0.05}
                min={0.05}
                max={1}
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                sx={style}
              />
              <div className="w-16 h-10 p-2 border border-br rounded-md text-center">
                <p>{topP}</p>
              </div>
            </div>
          </label>
          <div className="flex gap-2 px-4 mt-2">
            <button
              onClick={handleSave}
              className="text-primary hover:bg-primary/10 rounded p-2 px-3"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="text-primary hover:bg-primary/10 rounded p-2 px-3"
            >
              Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Setting;
