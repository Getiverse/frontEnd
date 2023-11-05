
function useUid() {
  const uid = sessionStorage.getItem("uid");
  return uid;
}

export default useUid;
