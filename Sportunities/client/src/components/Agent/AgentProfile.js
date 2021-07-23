import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAgent from "../../hooks/useAgent";
import { Container } from "@material-ui/core";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

const AgentProfile = () => {

  const params = useParams();
  const { actions } = useAgent();
  const [agent, setAgent] = useState(null);
  const { user } = useAuth();

  const isOwner = () => {
    return !!user && !!agent && user.id === agent.owner_id;
  };

  useEffect(() => {
    let isCancelled = false;
    actions.fetchAgent(params.id)
      .then(result => {
        if (!isCancelled) {
          setAgent(result);
        }
      }).catch(e => console.log(e));
    return () => {
      isCancelled = true;
    };

  }, []);

  return (
    <Container maxWidth="lg">
      <Header agent={agent} setAgent={setAgent} isOwner={isOwner}/>
    </Container>
  );
};

export default AgentProfile;
