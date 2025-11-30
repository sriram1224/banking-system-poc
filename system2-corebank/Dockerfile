# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-jammy as builder

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and the pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download the dependencies
RUN ./mvnw dependency:go-offline

# Copy the project source
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Create a new image for the deployment
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the jar from the builder
COPY --from=builder /app/target/*.jar app.jar

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the jar file 
ENTRYPOINT ["java","-jar","app.jar"]
