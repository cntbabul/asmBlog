const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={type}
        id={id}
        defaultValue={value}
        placeholder={placeholder}
        className="input-box"
      />
      <i className={"fi " + icon + " input-icon"}></i>

      {type == "password" ? (
        <i className="fi fi-rr-eye-crossed input-icon left-[auto] right-4 cursor-pointer"></i>
      ) : (
        ""
      )}
    </div>
  );
};
export default InputBox;

//TODO:1:24 https://youtu.be/J7BGuuuvDDk?si=3h-3ui7BVoCC0yIT
// {type == "password" ? (
// <i className="fi fi-rr-eye-crossed input-icon left-[auto] right-4 cursor-pointer"></i>

//   const [passwordVisible, setPasswordVisible] = useState(false);
//   type == "password" ? (passwordVisible ? "text" : "password") : type
//   onClick={() => setPasswordVisible((currentVal) => !currentVal)}
