export const fetchProperty = capacity => fetch(
  'property-manager.projects.bbdgrad.com/PropertyManager/Property',
  {
    method: 'PUT',
    body: JSON.stringify({
      size: capacity,
      toRent: true,
    }),
  }
).then(response => response.json())

export const confirmProperty = ({ persona, property, success }) => {
  return fetch(
    `property-manager.projects.bbdgrad.com/PropertyManager/Owner/${property.id}`
  )
    .then(response => response.json())
    .then(ownerId => fetch(
      'property-manager.projects.bbdgrad.com/PropertyManager/Property',
      {
        method: 'PUT',
        body: JSON.stringify({
          PropertyId: property.id,
          LandlordId: ownerId,
          TenantId: persona.id,
          isActive: success,
          Approval: success,
        })
      }
    ))
    .then(response => response.json())
}