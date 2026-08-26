const supabase = require("../config/supabase");

const createIncident = async (incidentData) => {
  const {
    category,
    location,
    dateTime,
    description,
    isAnonymous,
  } = incidentData;

  const { data, error } = await supabase
    .from("incidents")
    .insert([
      {
        category: category,
        location: location,
        incident_datetime: dateTime,
        description: description,
        is_anonymous: isAnonymous ?? true,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  createIncident,
};