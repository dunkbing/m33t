export const redirect = (location: string) =>
  new Response(null, {
    status: 302,
    headers: new Headers({
      location,
    }),
  });
